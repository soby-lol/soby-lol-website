"use client";
import { taskOnAirdrop } from "@/contracts";
import { TASKON_WHITELIST_ADDRESSES, getTaskOnMerkleTree } from "@/contracts/data/taskon_whitelisted";
import { useAppContext } from "@/providers/Context";
import { enoughGasPrice, logErrorToFirestore } from "@/utils/helpers";
import keccak256 from "keccak256";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { formatUnits } from "viem";
import { useAccount, useBalance, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "wagmi/actions";

export function useTaskOnSMC() {
    const [mounted, setMounted] = useState(false);
    const totalClaimableAmount = 21000000000000000;
    const [totalClaimedAmount, setTotalClaimedAmount] = useState(0);
    const [claimableAmount, setClaimableAmount] = useState(0);
    const [isClaimed, setIsClaimed] = useState(false);
    const [isPaused, setIspaused] = useState(true);
    const [claimLoading, setClaimLoading] = useState(false);
    const [isOnWhiteList, setIsOnWhitelist] = useState(false);
    const [error, setError] = useState("");
    
    const {address, isConnected} = useAccount();
    
    const { data: balance } = useBalance({
        address,
        watch: true,
    });
    const { data: walletClient } = useWalletClient();
    
    const {auth} = useAppContext();

    const publicClient = usePublicClient();
    let contract = useMemo(() => {
        return getContract(walletClient ? {...taskOnAirdrop, walletClient} : {...taskOnAirdrop});
    }, [walletClient]);

    const checkWhitelist = useCallback(async () => {
        try {
            if (address) {
                const data = TASKON_WHITELIST_ADDRESSES.find(a => a.address.toLowerCase() === address.toLowerCase());
                setIsOnWhitelist(!!data && !!data.address);
            }
            
        } catch(e){}
    }, [address, auth]);
    
    const getClaimableAmount = useCallback(async () => {
        try {
            if (contract && !isPaused && !isClaimed && isConnected) {
                const amount = (await contract.read.INIT_CLAIM([])) as bigint;
                setClaimableAmount(Number(formatUnits(amount, 6)));
            } else {
                setClaimableAmount(0);
            }
        } catch(e) {}
    }, [isPaused, isClaimed, isOnWhiteList, isConnected]);


    const getTotalClaimed = useCallback(async () => {
        try {
            if (contract) {
                const claimableAmount = (await contract.read.INIT_CLAIM([])) as bigint;
                const totalClaimedUsers = (await contract.read.claimedCount([])) as bigint;
                const totalClaimed = totalClaimedUsers * claimableAmount;
                setTotalClaimedAmount(Number(formatUnits(totalClaimed, 6)));
            }
        } catch(e) {}
    }, [isPaused, isClaimed]);

    const checkIsClaimed = useCallback(async () => {
        try {
            if (contract) {
                const isOk = (await contract.read.claimers([address])) as boolean;
                if (isOk) {
                    setClaimableAmount(0);
                }
                setIsClaimed(isOk);
            }
        } catch(e) {}
    }, [isPaused, isConnected, isOnWhiteList]);

    const checkSMCPaused = useCallback(async () => {
        try {
            if (contract) {
                const isOk = (await contract.read.paused([])) as boolean;
                setIspaused(isOk);
            }
        } catch(e) {}
    }, [address]);

    const gasEstimateForClaim = async () => {
        setError("");
        try {
            const taskOnMerkleTree = await getTaskOnMerkleTree();
            const leafNode = taskOnMerkleTree.getHexProof(
                keccak256(address as `0x${string}`)
            );
            const estimateGas = await contract.estimateGas.claim([leafNode]);
            return estimateGas;
        } catch (e) {
            logErrorToFirestore({
                message: (e as any)?.shortMessage,
                address,
                method: "claim-airdrop-growth"
            })
            console.log(e);
            return BigInt(0);
        }
    }

    const handleClaim = async() => {
        try {
            const isClaimed = (await contract.read.claimers([address])) as boolean;
            if (isClaimed) {
                setClaimableAmount(0);
                setIsClaimed(true);
                return toast.error("Already Claimed", {autoClose: 3000});
            }

            const gasEst = await gasEstimateForClaim();
            if (gasEst <= 0) {
                return toast.error("Not enough balance", {autoClose: 1500});
            }

            const _enoughGasPrice = enoughGasPrice(
                balance?.value as bigint,
                0 as any,
                gasEst
            );

            if (!_enoughGasPrice) return;

            const taskOnMerkleTree = await getTaskOnMerkleTree();
            const leafNode = taskOnMerkleTree.getHexProof(
                keccak256(address as `0x${string}`)
            );

            const transaction = await contract.write.claim([leafNode]);
            
            if (transaction && publicClient) {
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: transaction,
                });

                if (receipt && receipt?.status === "success") {
                    setIsClaimed(true);
                    setClaimableAmount(0);
                    toast.success("Airdrop claimed successfully");
                }
            }
        } catch (error: any) {
            console.log(error)
            if (!!error.message && error.message.search(/User rejected the request/i) > -1) {
                toast.error("User rejected the request", {autoClose: 3000});
            } else {
                logErrorToFirestore({
                    message: (error as any)?.shortMessage,
                    address,
                    method: "claim-airdrop-growth"
                })
                toast.error("Unable to claim. Please retry.");
            }
        }
    }
    const onClaim = useCallback(async () => {
        setClaimLoading(true);
        await handleClaim();
        setClaimLoading(false);
    }, [contract]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            getTotalClaimed();
        }
    }, [mounted, isClaimed, onClaim, balance]);

    useEffect(() => {
        if (mounted) {
            checkWhitelist();
            checkSMCPaused();
        }
    }, [mounted]);

    useEffect(() => {
        if (mounted && !isPaused && isOnWhiteList && isConnected) {
            checkIsClaimed();
        }
    }, [mounted, isOnWhiteList, isConnected, isPaused]);

    useEffect(() => {
        if (mounted && !isPaused && !isClaimed && isOnWhiteList) {
            getClaimableAmount();
        } else {
            setClaimableAmount(0);
        }
    }, [mounted, isPaused, isClaimed, isConnected, isOnWhiteList]);

    return {
        claimableAmount, totalClaimableAmount, totalClaimedAmount,
        isClaimed, isPaused, claimLoading, isOnWhiteList, 
        onClaim, error
    };
};