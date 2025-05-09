"use client";
import { checkOnWhitelist, claimAirdrop } from "@/api/soby";
import { distributionAirdrop } from "@/contracts";
import { useAppContext } from "@/providers/Context";
import { SignatureRes } from "@/types/api";
import { enoughGasPrice, logErrorToFirestore } from "@/utils/helpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { formatUnits } from "viem";
import { useAccount, useBalance, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "wagmi/actions";

export function useDistributionSMC() {
    const [mounted, setMounted] = useState(false);
    const [totalClaimableAmount, setTotalClaimableAmount] = useState(0);
    const [totalClaimedAmount, setTotalClaimedAmount] = useState(0);
    const [claimableAmount, setClaimableAmount] = useState(0);
    const [isClaimed, setIsClaimed] = useState(false);
    const [isOnWhiteList, setIsOnWhitelist] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [claimLoading, setClaimLoading] = useState(false);
    const {address, isConnected} = useAccount();
    const { data: walletClient } = useWalletClient();
    const {chain} = useAppContext();
    
    const {auth} = useAppContext();

    const publicClient = usePublicClient() as any;

    const { data: balance } = useBalance({
        address,
        watch: true,
    });
    
    let contract = useMemo(() => {
        return getContract(walletClient ? {...distributionAirdrop, walletClient} : {...distributionAirdrop});
    }, [walletClient]);
    
    const getTotalClaimableAmount = useCallback(async () => {
        try {
            if (contract) {
                const amount = (await contract.read.MAX_TOKEN([])) as bigint;
                setTotalClaimableAmount(Number(formatUnits(amount, 6)));
            }
        } catch(e) {}
    }, [chain, totalClaimableAmount]);

    const getTotalClaimedAmount = useCallback(async () => {
        try {
            if (contract) {
                const amount = (await contract.read.claimedSupply([])) as bigint;
                setTotalClaimedAmount(Number(formatUnits(amount, 6)));
            }
        } catch(e) {}
    }, [chain]);

    const getClaimableAmount = useCallback(async () => {
        try {
            if (contract && isOnWhiteList && isConnected) {
                const isClaimed =  (await contract.read._claimedUser([address])) as boolean;
                setIsClaimed(isClaimed);
                if (!isClaimed) {
                    const amount = (await contract.read.canClaimAmount([])) as bigint;
                    setClaimableAmount(Number(formatUnits(amount, 6)));
                }
            } else {
                setClaimableAmount(0);
            }
        } catch(e){}
    }, [contract, address, isOnWhiteList, chain, isConnected]);

    const checkWhitelist = useCallback(async () => {
        setIsChecking(true);
        try {
            const res = await checkOnWhitelist(auth?.token);
            const data = await res.json();
            setIsOnWhitelist(data && data.status);
        } catch(e){}
        setIsChecking(false);
    }, [address, auth, chain]);

    const gasEstimateForClaim = async (data:any[]) => {
        try {
            const estimateGas = await contract.estimateGas.claim(data);
            return estimateGas;
        } catch (e) {
            logErrorToFirestore({
                message: (e as any)?.shortMessage,
                address,
                method: "claim-airdrop-ecosystem"
            })
            console.log(e);
            return BigInt(0);
        }
    }

    const onClaim = useCallback(async () => {
        if (contract) {
            const f = async() => {
                try {
                    const isClaimed =  (await contract.read._claimedUser([address])) as boolean;
                    if (isClaimed) {
                        setClaimableAmount(0);
                        setIsClaimed(true);
                        return toast.error("Already Claimed", {autoClose: 3000});
                    }

                    const res = await claimAirdrop(auth?.token);
                    const dataSign = (await res.json()) as SignatureRes;
                    if (dataSign && dataSign.signature && dataSign.nonce) {
                        const gasEst = await gasEstimateForClaim([dataSign.nonce, dataSign.signature, "0x0000000000000000000000000000000000000000"]);
                        if (gasEst <= 0) {
                            return toast.error("Not enough balance", {autoClose: 1500});
                        }

                        const _enoughGasPrice = enoughGasPrice(
                            balance?.value as bigint,
                            0 as any,
                            gasEst
                        );

                        if (!_enoughGasPrice) return;
                        
                        const transaction = await contract.write.claim([dataSign.nonce, dataSign.signature, "0x0000000000000000000000000000000000000000"]);
                        if (transaction && publicClient) {
                            const receipt = await publicClient.waitForTransactionReceipt({
                                hash: transaction,
                            });

                            if (receipt && receipt?.status === "success") {
                                setIsClaimed(true);
                                setClaimableAmount(0);
                                toast.success("Airdrop claimed successfully!");                
                            }
                        }
                    }
                } catch (error: any) {
                    if (!!error.message && error.message.search(/User rejected the request/i) > -1) {
                        toast.error("User rejected the request", {autoClose: 3000});
                    } else {
                        toast.error("Unable to claim. Please retry.");
                        logErrorToFirestore({
                            message: (error as any)?.shortMessage,
                            address,
                            method: "claim-airdrop-ecosystem"
                        })
                    }
                }
            }
            setClaimLoading(true);
            await f();
            setClaimLoading(false);
        }
        setClaimLoading(false);
    }, [contract]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            getTotalClaimableAmount();
            getTotalClaimedAmount();
        }
    }, [mounted, chain]);

    useEffect(() => {
        getClaimableAmount();
    }, [mounted, address, isClaimed, isOnWhiteList, chain, isConnected, contract]);

    useEffect(() => {
        if (address && auth ) {
            checkWhitelist();
        }
    }, [mounted, address, auth, chain]);

    return {totalClaimableAmount, totalClaimedAmount, claimableAmount, isChecking, isClaimed, isOnWhiteList, claimLoading, onClaim};
};