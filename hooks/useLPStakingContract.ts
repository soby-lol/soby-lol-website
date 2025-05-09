import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useBlockNumber, usePublicClient, useWalletClient } from "wagmi";
import { routerSwapSMC, sobySMC, lpStakingSMC, lpTokenSMC } from "@/contracts";
import { toast } from "react-toastify";
import { FormatNumber, enoughGasPrice } from "@/utils/helpers";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { getContract } from "wagmi/actions";
import { 
    APP_SOBY_ADDRESS, 
    APP_USDC_ADDRESS, 
    APP_WETH_ADDRESS, 
    APP_LP_TOKEN,
    DEFINED_GRAPH_URL,
    DEFINED_API_KEY,
    DECIMAL,
    APP_LP_STAKING_SMC,
    LP_STAKING_DEFAULT_POOL_ID} from "@/types/common";
import { useAppContext } from "@/providers/Context";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { DefinedPairMetadata, DefinedPairMetadataDefault } from "@/types/api";
import { metadata } from "@/app/layout";
// import { useSearchParams } from "next/navigation";

export type LPStakingContract = {
    isSubmitStaking: boolean;
    isSubmitWithdraw: boolean;
    isSubmitHarvest: boolean;
    apr: number;
    penaltyFee: number,
    penaltyBlock: number;
    latestDepositBlock: number;
    currentBlock: number;
    tvl: number;
    pendingReward:number;
    totalStaked:  number;
    userInfo: UserStakeInfo | undefined;
    withdrawable: boolean;
    sobyPrice: number;
    lpPrice: number;
    lpBalance: number;
    startBlock: number;
    bonusEndTime: string;
    bonusEndBlock: number;
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

export function useLPStakingContract():LPStakingContract {
    const [isSubmitStaking, setIsSubmitStaking] = useState(false);
    const [isSubmitWithdraw, setIsSubmitWithdraw] = useState(false);
    const [isSubmitHarvest, setIsSubmitHarvest] = useState(false);
    const [penaltyFee, setPenaltyFee] = useState(2);
    const [sobyPrice, setSobyPrice] = useState(0);
    const [userInfo, setUserInfo] = useState<UserStakeInfo|undefined>(undefined);
    const [apr, setAPR] = useState(0.00);
    const [pendingReward, setPendingReward] = useState(0);
    const [totalStaked, setTotalStaked] = useState(0);
    const [withdrawable, setWithdrawable] = useState(false);
    const [startBlock, setStartBlock] = useState(0);
    const [endBlockTime, setEndBlockTime] = useState('');
    const [endBlockNumber, setEndBlockNumber] = useState(0);
    const [lpTotalSupply, setLPTotalSupply] = useState(0);
    const [pairMetadata, setPairMetadata] = useState<DefinedPairMetadata>(DefinedPairMetadataDefault);
    const [penaltyBlock, setPenaltyBlock] = useState(0);
    const [currentBlock, setCurrentBlock] = useState(0);
    const [latestDepositBlock, setLatestDepositBlock] = useState(0);

    // const searchParams = useSearchParams()
    // let pid = searchParams.get("pid") || LP_STAKING_DEFAULT_POOL_ID;
    const [poolId, setPoolId] = useState(BigInt(0));

    const definedClient = useMemo(() => {
        return new ApolloClient({ uri: DEFINED_GRAPH_URL, cache: new InMemoryCache(), headers: {Authorization: DEFINED_API_KEY} });
    }, []);

    const {chainSupported} = useAppContext();
    const publicClient = usePublicClient({chainId: chainSupported?.id}) as any;
    const { data: walletClient } = useWalletClient();

    const {address} = useAccount();

    const getPairMetadata = async() => {
        const QUERY_GET_BUNDLES_DATA = gql`
        query {
            pairMetadata (pairId:"${APP_LP_TOKEN}:${chainSupported.id}" quoteToken:token1) {
              pairAddress
              liquidity
              volume24
            }
          }
        `;

        try {
            const response = await definedClient.query({
                query: QUERY_GET_BUNDLES_DATA,
            }) as { data: { pairMetadata: DefinedPairMetadata } };
            if (response.data && response.data.pairMetadata) {
                const metadata = response.data.pairMetadata;
                if (metadata) {
                    setPairMetadata(metadata)

                    // Calculate APR: (VOLUME24h * 0.5% * 365 / LIQUIDITY)*100
                    const liq = Number(metadata.liquidity);
                    const vol24h = Number(metadata.volume24);
                    if (liq > 0 && vol24h > 0) {
                        setAPR((vol24h * 0.005 * 365 / liq) * 100)
                    }
                }
            }

        } catch (err) {
            console.log(err);
        }
    }

    const { data: xaiBalance } = useBalance({
        address,
        watch: false,
        chainId: chainSupported.id
    });

    const { data: sobyOfLPData } = useBalance({
        token: APP_SOBY_ADDRESS as any,
        address: APP_LP_TOKEN as any,
        watch: false,
        chainId: chainSupported.id
    });

    const sobyOfLPBalance = useMemo(() => {
        if (!sobyOfLPData) return 0;
        return Number(formatUnits(sobyOfLPData.value, DECIMAL)); 
    }, [sobyOfLPData]);
    
    let stakingContract = useMemo(() => {
        return getContract(walletClient ? {...lpStakingSMC, walletClient, chainId: chainSupported.id} : {...lpStakingSMC, chainId: chainSupported.id});
    }, [walletClient]);

    let lpTokenContract = useMemo(() => {
        return getContract(walletClient ? {
            ...lpTokenSMC,
            walletClient,
            chainId: chainSupported.id
        } : { ...lpTokenSMC, chainId: chainSupported.id });
    }, [walletClient]);

    let routerSwapContract = useMemo(() => {
        return getContract({...routerSwapSMC, chainId: chainSupported.id});
    }, []);

    const { data: LPData } = useBalance({
        address: address ?? "0x0000000000000000000000000000000000000000",
        token: APP_LP_TOKEN as any,
        watch: false,
        chainId: chainSupported.id,
    });

    const lpTokenBalance = useMemo(() => {
        if (!LPData) return 0;
        return Number(formatEther(LPData.value as any));
    }, [LPData]);

    const getTotalLPSupply = async () => {
        if (!lpTokenContract) return 0;
        const value = (await lpTokenContract.read.totalSupply()) as bigint;
        setLPTotalSupply(Number(formatEther(value)))
    };

    // 2,250T * 365 / 30 / LP.balanceOf(StakingSMC) * LP.totalSupply() / soby.balanceOf(LP)
    const calcAPR = useCallback(async() => {
        if (totalStaked=== 0 || sobyOfLPBalance === 0) return 0;
        const rewardPerBlock = (await stakingContract.read.rewardPerBlock()) as any;
        const totalReward = (2592000*Number(rewardPerBlock));
        const sobyBal = parseUnits(sobyOfLPBalance.toString(), DECIMAL)
        const apr = (totalReward*365*lpTotalSupply) / (30*Number(sobyBal)*totalStaked); // 4604394
        setAPR(apr * 100);
    }, [poolId, totalStaked, lpTokenBalance, lpTotalSupply]);

    const getSobyPrice = useCallback(async() => {
        try {
            const price = await routerSwapContract.read.getAmountsOut([parseUnits("10000000000", DECIMAL), [APP_SOBY_ADDRESS, APP_WETH_ADDRESS, APP_USDC_ADDRESS]]) as bigint[];
            setSobyPrice(Number(formatUnits(price[2], Number(DECIMAL)+10)));
        } catch(e) {
            console.log(e);
        }

    }, [routerSwapContract, sobyPrice]);

    const lpPrice = useMemo(() => {
        const totalLPPriceBySoby = sobyOfLPBalance * sobyPrice * 2
        if (lpTotalSupply > 0) {
            return totalLPPriceBySoby / lpTotalSupply
        }
        return 0
    }, [sobyOfLPBalance, sobyPrice, lpTotalSupply])

    const gasEstimateForDeposit = async (amount:bigint) => {
        try {
            const estimateGas = await stakingContract.estimateGas.deposit([poolId, amount], {account: address!});
            return estimateGas;
        } catch (e) {
            return BigInt(0);
        }
    }

    const getAllowance = async() => {
        const allowance =  await lpTokenContract.read.allowance([address as any, stakingContract.address]);
        return allowance;
    }

    const approve = async (amount:bigint) => {
        const transaction =  await lpTokenContract.write.approve([stakingContract.address, amount]);
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
            const amountUnits = parseEther(amount);
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
                    xaiBalance?.value as bigint,
                    0 as any,
                    gasEst
                );

                if (!_enoughGasPrice) return;

                const transaction = await stakingContract.write.deposit([poolId, amountUnits]);
                
                if (transaction && publicClient) {
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash: transaction,
                    });

                    if (receipt && receipt?.status === "success") {
                        toast.success("Deposited successfully!");
                        setWithdrawable(true);
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
        
    }, [stakingContract, poolId]);

    const onWithdraw = useCallback(async (amount:bigint) => {
        if (!stakingContract) return;
        const f = async() => {
            try {
                const transaction = await stakingContract.write.withdraw([poolId, amount]);
                
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
    }, [stakingContract, poolId]);

    const onHarvest = useCallback(async () => {
        if (!stakingContract) return;
        const f = async() => {
            try {

                const transaction = await stakingContract.write.harvest([poolId]);
                
                if (transaction && publicClient) {
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash: transaction,
                    });
    
                    if (receipt && receipt?.status === "success") {
                        toast.success("Harvested successfully!");
                        await getPendingReward();
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
    }, [stakingContract, poolId]);
    
    const getUserInfo = useCallback(async () => {
        if (address) {
            const info = (await stakingContract.read.userInfo([address, poolId])) as any[];
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
    }, [address, lpTokenBalance, sobyOfLPBalance, withdrawable, stakingContract, poolId]);

    const calcEndBlockTime = async () => {
        try {
            const poolInfo = (await stakingContract.read.poolInfo([poolId])) as any[];
            setStartBlock(Number(Number(poolInfo[4])));
            const startBlock = await publicClient.getBlock({ blockNumber: Number(poolInfo[4]) });
            const endBonusTimestamp = Number(startBlock.timestamp) + (30 * 86400);
            const endBonusDate = new Date(endBonusTimestamp*1000);
            setEndBlockNumber(Number(poolInfo[5]));
            setEndBlockTime(
                new Intl.DateTimeFormat("en", {month: 'short', day: 'numeric', year: 'numeric'}).format(endBonusDate)
            );
        } catch(e:any){
            console.log(e)
        }
    }

    const getPenaltyFee = useCallback(async() => {
        try {
            const fee = (await stakingContract.read.penaltyFee([])) as bigint;
            setPenaltyFee(Number(fee)/100);

            const currentBlock = await publicClient.getBlock();
            let latestBlock = Number(currentBlock.number);
            if (userInfo) {
                latestBlock = Number(userInfo.lastDeposit);
            }

            const block = (await stakingContract.read.penaltyBlock([])) as bigint;
            setCurrentBlock(Number(currentBlock.number));
            setPenaltyBlock(Number(block));
            setLatestDepositBlock(latestBlock);
        } catch(e) {
            setPenaltyFee(0);
        }
        
    }, [stakingContract, userInfo, penaltyFee]);

    const getTotalStacked = useCallback(async() => {
        let totalStakedAmount = 0;
        try {
            const totalStaked = (await stakingContract.read.totalStaked([])) as bigint;
            totalStakedAmount = Number(formatEther(totalStaked)) || 0;
        } catch(e){}

        setTotalStaked(totalStakedAmount);
    }, [stakingContract]);

    const getPendingReward = useCallback(async() => {
        const amount =  (await stakingContract.read.pendingReward([poolId, address!])) as bigint;
        setPendingReward(Number(formatUnits(amount, DECIMAL)));
    }, [address, userInfo?.rewardDebt, lpTokenBalance, pendingReward, poolId]);

    const checkWithdrawable = useCallback(async() => {
        setWithdrawable(false);
        await getUserInfo();
        if (userInfo) {
            const penaltyBlock = (await stakingContract.read.penaltyBlock([])) as bigint;
            const currentBlock = await publicClient.getBlock();
            if (Number(currentBlock.number) >= Number(userInfo.lastDeposit) + Number(penaltyBlock) ){
                setWithdrawable(true);
            }
        }
        
    }, [poolId, userInfo?.lastDeposit, withdrawable, lpTokenBalance]);

    const getPoolInfo = async () => {
        const poolInfo = (await stakingContract.read.poolInfo([poolId])) as any[];
        const rewardPerBlock = (await stakingContract.read.rewardPerBlock()) as any;
        console.log(`
        PoolId: ${poolId}
        LP Token Address: ${poolInfo[0]}
        Reward Per Block: ${FormatNumber(Number(rewardPerBlock))}
        Alloc Point: ${FormatNumber(Number(poolInfo[1]))}
        Last Reward Block: ${FormatNumber(Number(poolInfo[2]))}
        Acc Cake Per Share: ${FormatNumber(Number(poolInfo[3]))}
        Start Block: ${FormatNumber(Number(poolInfo[4]))}
        Bonus End Block: ${FormatNumber(Number(poolInfo[5]))}
        `)
    }

    useEffect(() => {
        getSobyPrice();
    },[routerSwapContract]);

    useEffect(() => {
        if (stakingContract) {
            calcEndBlockTime();
            getTotalStacked();
            getPenaltyFee();
        }
    }, [stakingContract, userInfo, lpTokenBalance, sobyOfLPBalance, poolId]);

    useEffect(() => {
        getTotalLPSupply();
    }, [lpTokenContract, stakingContract, poolId]);

    useEffect(() => {
        getUserInfo();
    }, [poolId, stakingContract, address, onHarvest, onDeposit, onWithdraw, lpTokenBalance]);

    useEffect(() => {
        getPendingReward();
    }, [poolId, stakingContract, address, lpTokenBalance, onHarvest, onWithdraw]);

    useEffect(() => {
        checkWithdrawable();
    }, [poolId, userInfo?.lastDeposit, userInfo?.amount, lpTokenBalance, stakingContract]);

    useEffect(() => {
        calcAPR();
        // getPairMetadata();
        // const bundelInterval = setInterval(getPairMetadata, 60000);
        //return () => clearInterval(bundelInterval);
    }, [poolId, totalStaked, lpTokenBalance, lpTotalSupply])

    return {
        startBlock,
        bonusEndTime: endBlockTime,
        bonusEndBlock: endBlockNumber,
        isSubmitStaking,
        isSubmitWithdraw,
        isSubmitHarvest,
        apr,
        tvl: lpTotalSupply,
        pendingReward,
        totalStaked,
        userInfo,
        penaltyFee,
        penaltyBlock,
        currentBlock,
        latestDepositBlock,
        withdrawable,
        sobyPrice,
        lpPrice,
        lpBalance: lpTokenBalance,
        onDeposit,
        onWithdraw,
        onHarvest,
    };
}