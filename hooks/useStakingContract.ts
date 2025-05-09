import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useBlockNumber, usePublicClient, useWalletClient } from "wagmi";
import { routerSwapSMC, sobySMC, stakingSMC } from "@/contracts";
import { toast } from "react-toastify";
import { enoughGasPrice } from "@/utils/helpers";
import { formatUnits, parseUnits } from "viem";
import { getContract } from "wagmi/actions";
import { 
    APP_SOBY_ADDRESS, 
    APP_USDC_ADDRESS, 
    APP_WETH_ADDRESS, 
    BLOCK_TIMES, DECIMAL, 
    STAKING_CREATED_BLOCK, 
    STAKING_CREATED_TIMESTAMP, 
    BLOCK_TIMES_DEFAULT } from "@/types/common";
import { useAppContext } from "@/providers/Context";

export type StakingContract = {
    isSubmitStaking: boolean;
    isSubmitWithdraw: boolean;
    isSubmitHarvest: boolean;
    limitAmount: number;
    apr: number;
    penaltyFee: number,
    liquidity: number;
    pendingReward:number;
    totalStaked:  number;
    userInfo: UserStakeInfo | undefined;
    withdrawable: boolean;
    sobyPrice: number;
    calcAPR: (amount:number) => Promise<number>;
    onDeposit: (amount:string) => Promise<void>;
    onWithdraw: (amount:bigint) => Promise<void>;
    onHarvest: () => Promise<void>;
};

export type UserStakeInfo = {
    amount: bigint;
    rewardDebt:bigint;
    lastDeposit:bigint;
    inBlackList:boolean;
};

export function useStakingContract():StakingContract {
    const [isSubmitStaking, setIsSubmitStaking] = useState(false);
    const [isSubmitWithdraw, setIsSubmitWithdraw] = useState(false);
    const [isSubmitHarvest, setIsSubmitHarvest] = useState(false);
    const [limitAmount, setLimitAmount] = useState(0);
    const [penaltyFee, setPenaltyFee] = useState(2);
    const [sobyPrice, setSobyPrice] = useState(0);
    const [userInfo, setUserInfo] = useState<UserStakeInfo|undefined>(undefined);
    const [apr, setAPR] = useState(0.00);
    const [liquidity, setLiquidity] = useState(0);
    const [pendingReward, setPendingReward] = useState(0);
    const [totalStaked, setTotalStaked] = useState(0);
    const [withdrawable, setWithdrawable] = useState(false);

    const {chain, chainSupported} = useAppContext();
    const publicClient = usePublicClient({chainId: chainSupported.id}) as any;
    const { data: walletClient } = useWalletClient();

    const {address} = useAccount();
    const { data: balance } = useBalance({
        address,
        watch: true,
        chainId: chainSupported.id
    });
    
    let stakingContract = useMemo(() => {
        return getContract(walletClient ? {...stakingSMC, walletClient, chainId: chainSupported.id} : {...stakingSMC, chainId: chainSupported.id});
    }, [walletClient]);

    let sobyContract = useMemo(() => {
        return getContract(walletClient ? {
            ...sobySMC, 
            walletClient,
            chainId: chainSupported.id
            
        } : { ...sobySMC });
    }, [walletClient]);

    let routerSwapContract = useMemo(() => {
        return getContract({...routerSwapSMC, chainId: chainSupported.id});
    }, []);

    const { data: sobyData } = useBalance({
        address: address ?? "0x0000000000000000000000000000000000000000",
        token: APP_SOBY_ADDRESS as any,
        watch: true,
        chainId: chainSupported.id
    });

    const sobyBalance = useMemo(() => {
        if (!sobyData) return 0;
        return Number(formatUnits(sobyData.value as any, DECIMAL));
    }, [sobyData, userInfo]);

    const getSobyPrice = useCallback(async() => {
        try {
            const price = await routerSwapContract.read.getAmountsOut([parseUnits("100000", DECIMAL), [APP_SOBY_ADDRESS, APP_WETH_ADDRESS, APP_USDC_ADDRESS]]) as bigint[];
            setSobyPrice(Number(formatUnits(price[2], Number(DECIMAL)+5)));
        } catch(e) {
            console.log(e);
        }

    }, [routerSwapContract, sobyPrice]);

    const gasEstimateForDeposit = async (amount:bigint) => {
        try {
            const estimateGas = await stakingContract.estimateGas.deposit([amount], {account: address!});
            return estimateGas;
        } catch (e) {
            return BigInt(0);
        }
    }

    const getAllowance = async() => {
        const allowance =  await sobyContract.read.allowance([address as any, stakingContract.address]);
        return allowance;
    }

    const approve = async (amount:bigint) => {
        const transaction =  await sobyContract.write.approve([stakingContract.address, amount]);
        if (transaction && publicClient) {
            
            const receipt = await publicClient.waitForTransactionReceipt({
                hash: transaction,
            });

            if (receipt && receipt?.status === "success") {
                return true
            }
        }
        return false;
    }

    const onDeposit = useCallback(async (amount: string) => {
        if (!stakingContract) return;

        const f = async() => {
            const amountUnits = parseUnits(amount, DECIMAL);
            try {

                const allowance = await getAllowance();
                if (allowance < amountUnits) {
                    const isApprove = await approve(amountUnits);
                    if (!isApprove) return;
                }

                const gasEst = await gasEstimateForDeposit(amountUnits);
                if (gasEst <= 0) {
                    return toast.error("Not enough balance", {autoClose: 1500});
                }

                const _enoughGasPrice = enoughGasPrice(
                    balance?.value as bigint,
                    0 as any,
                    gasEst
                );

                if (!_enoughGasPrice) return;

                const transaction = await stakingContract.write.deposit([amountUnits]);
                
                if (transaction && publicClient) {
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash: transaction,
                    });

                    if (receipt && receipt?.status === "success") {
                        toast.success("Deposited successfully!");                
                    }
                }
            } catch (error: any) {
                if (!!error.message && error.message.search(/User rejected the request/i) > -1) {
                    toast.error("User rejected the request", {autoClose: 3000});
                } else {
                    toast.error("Unable to deposit. Please retry!");
                }
            }
        }
        setIsSubmitStaking(true);
        await f();
        await checkWithdrawable();
        setIsSubmitStaking(false);
        
    }, [stakingContract, sobyBalance]);

    const onWithdraw = useCallback(async (amount:bigint) => {
        if (!stakingContract) return;
        const f = async() => {
            try {
                const transaction = await stakingContract.write.withdraw([amount]);
                
                if (transaction && publicClient) {
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash: transaction,
                    });
    
                    if (receipt && receipt?.status === "success") {
                        toast.success("Unstaked successfully!");                
                    }
                }
            } catch (error: any) {
                if (!!error.message && error.message.search(/User rejected the request/i) > -1) {
                    toast.error("User rejected the request", {autoClose: 3000});
                } else {
                    toast.error("Unable to unstake. Please retry!");
                }
            }
        }

        setIsSubmitWithdraw(true);
        await f();
        setIsSubmitWithdraw(false);
    }, [stakingContract, sobyBalance]);

    const onHarvest = useCallback(async () => {
        if (!stakingContract) return;
        const f = async() => {
            try {

                const transaction = await stakingContract.write.harvest();
                
                if (transaction && publicClient) {
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash: transaction,
                    });
    
                    if (receipt && receipt?.status === "success") {
                        toast.success("Harvested successfully!");                
                    }
                }
            } catch (error: any) {
                if (!!error.message && error.message.search(/User rejected the request/i) > -1) {
                    toast.error("User rejected the request", {autoClose: 3000});
                } else {
                    toast.error("Unable to harvest. Please retry!");
                }
            }
        }

        setIsSubmitHarvest(true);
        await f();
        setIsSubmitHarvest(false);
    }, [stakingContract, sobyBalance]);

    
    const getUserInfo = useCallback(async () => {
        if (address) {
            const info = (await stakingContract.read.userInfo([address])) as any[];
            if (info.length === 4) {
                setUserInfo((_state) => ({
                    amount: info[0] as bigint, 
                    rewardDebt: info[1] as bigint, 
                    lastDeposit: info[2] as bigint, 
                    inBlackList: info[3] as boolean
                }))
            }
        } else {
            setUserInfo(undefined)
        }
    }, [address, sobyBalance, userInfo, withdrawable]);

    const getLimitAmount =  useCallback(async() => {
        if (userInfo) {
            const limit =  (await stakingContract.read.limitAmount()) as bigint;
            if (userInfo && limit) {
                const stakeLimit = Number(formatUnits(limit - userInfo.amount, DECIMAL));
                setLimitAmount(stakeLimit);
            } else {
                setLimitAmount(0);
            }
        }
        
    }, [userInfo, sobyBalance, limitAmount]);

    const calcAPR = useCallback(async(amount:number) => {
        const rewardPerBlock =  (await stakingContract.read.rewardPerBlock()) as bigint;
        const rewardPerBlockAmount = Number(formatUnits(rewardPerBlock, DECIMAL));
        const bonusEndBlock = (await stakingContract.read.bonusEndBlock([])) as bigint;
        const currentBlock = await publicClient.getBlock(); // getCurrentBlock();
        const reward = rewardPerBlockAmount * Number(bonusEndBlock + currentBlock.number);
        if (!reward || reward <=0 ) return 0;

        if (reward <= 0 || reward === Infinity) return 0;
        if (amount > 0) {
            return Number(((reward / amount) *100).toFixed(8));
        }

        return Number((reward *100).toFixed(2));
    }, [stakingContract]);

    const getTotalLP = useCallback(async() => {
        try {
            const totalLP = (await sobyContract.read.balanceOf([stakingContract.address])) as bigint;
            const totalLBAmount = Number(formatUnits(totalLP, DECIMAL)); 
            console.log(totalLBAmount, sobyPrice)
            setLiquidity(totalLBAmount*sobyPrice);
        } catch(e) {
            setLiquidity(0);
        }
        
    }, [sobyContract, sobyBalance, sobyPrice, liquidity]);

    const getPenaltyFee = useCallback(async() => {
        try {
            const penaltyFee = (await stakingContract.read.penaltyFee([])) as bigint;
            setPenaltyFee(Number(penaltyFee)/100);
        } catch(e) {
            setPenaltyFee(0);
        }
        
    }, [stakingContract, penaltyFee]);

    const getTotalStacked = useCallback(async() => {
        let totalStakedAmount = 0;
        try {
            const totalStaked = (await stakingContract.read.totalStaked([])) as bigint;
            totalStakedAmount = Number(formatUnits(totalStaked, DECIMAL)) || 0;
        } catch(e){}

        const aprAmount = await calcAPR(totalStakedAmount);
        setTotalStaked(totalStakedAmount);
        setAPR(aprAmount);
    }, [stakingContract, sobyBalance, totalStaked]);

    const getPendingReward = useCallback(async() => {
        const amount =  (await stakingContract.read.pendingReward([address!])) as bigint;
        setPendingReward(Number(formatUnits(amount, DECIMAL)));
    }, [address, sobyBalance, pendingReward]);

    const checkWithdrawable = useCallback(async() => {
        setWithdrawable(false);
        if (userInfo) {
            const penaltyBlock = (await stakingContract.read.penaltyBlock([])) as bigint;
            const currentBlock = await publicClient.getBlock(); // getCurrentBlock();
            if (Number(currentBlock.number) >= Number(userInfo.lastDeposit) + Number(penaltyBlock) ){
                setWithdrawable(true);
            }
        }
        
    }, [userInfo, sobyBalance, withdrawable]);

    useEffect(() => {
        getSobyPrice();
    },[routerSwapContract]);

    useEffect(() => {
        if (stakingContract) {
            getTotalStacked();
            getPenaltyFee();
        }
    }, [stakingContract, sobyBalance]);

    useEffect(() => {
        getTotalLP();
    }, [sobyContract, sobyBalance, sobyPrice]);

    useEffect(() => {
        getUserInfo();
    }, [address, sobyBalance, onDeposit, onHarvest, onWithdraw]);

    useEffect(() => {
        getPendingReward();
    }, [address, sobyBalance]);

    useEffect(() => {
        getLimitAmount();
        checkWithdrawable();
    }, [userInfo?.lastDeposit, userInfo?.amount, sobyBalance]);

    useEffect(() => {
        
    }, [totalStaked])

    return {
        isSubmitStaking,
        isSubmitWithdraw,
        isSubmitHarvest,
        limitAmount,
        apr,
        liquidity,
        pendingReward,
        totalStaked,
        userInfo,
        penaltyFee,
        withdrawable,
        sobyPrice,
        calcAPR,
        onDeposit,
        onWithdraw,
        onHarvest,
    };
}