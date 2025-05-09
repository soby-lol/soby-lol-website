"use client";
import { luckyDraw, routerSwapSMC, sobySMC } from "@/contracts";
import { useAppContext } from "@/providers/Context";
import { Bundle, Ticket } from "@/types/api";
import { APP_JACKPOT_SMC, APP_JACKPOT_TIME_DURATION, APP_SOBY_ADDRESS, APP_USDC_ADDRESS, APP_WETH_ADDRESS, DECIMAL, SOBY_GRAPHQL } from "@/types/common";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useBalance, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "wagmi/actions";

const JACKPOT_TIME_DURATION = Number(APP_JACKPOT_TIME_DURATION);
export type LuckyDrawSMC = {
    isCountDown: boolean;
    currentRound: number;
    totalDistributed: number;
    currentRoundRewards: number;
    totalPlayers: number; 
    totalWinners: number;
    timeEnd: number;
    wxaiPrice: number;
};

export function useLuckyDrawSMC():LuckyDrawSMC {
    const [mounted, setMounted] = useState(false);
    const [totalDistributed, setTotalDistributed] = useState(0);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [totalWinners, setTotalWinners] = useState(0);
    const [timeEnd, setTimeEnd] = useState(0);
    const [isCountDown, setIsCountDown] = useState(false);
    const [xaiPrice, setXaiPrice] = useState(0)
    const clientApolo = new ApolloClient({ uri: SOBY_GRAPHQL, cache: new InMemoryCache() });
    const { data: walletClient } = useWalletClient();
    const {auth, chainSupported} = useAppContext();

    let routerSwapContract = useMemo(() => {
        return getContract({...routerSwapSMC, chainId: chainSupported.id});
    }, []);

    const publicClient = usePublicClient();

    let contract = useMemo(() => {
        return  getContract(walletClient ? {...luckyDraw, walletClient, chainId: chainSupported.id} : {...luckyDraw, chainId: chainSupported.id});
    }, [walletClient]);

    const { data: jackpotData } = useBalance({
        chainId: chainSupported.id,
        address: APP_JACKPOT_SMC as `0x${string}`,
        token: APP_WETH_ADDRESS as any,
        watch: true,
    });

    const jackpotBal = useMemo(() => {
        if (!jackpotData) return 0;
        return Number(formatUnits(jackpotData.value as any, 18));
    }, [jackpotData]);

    const getWXaiPrice = useCallback(async() => {
        try {
            const price = await routerSwapContract.read.getAmountsOut([parseUnits("1", 18), [APP_WETH_ADDRESS, APP_USDC_ADDRESS]]) as bigint[];
            setXaiPrice(Number(formatUnits(price[1], DECIMAL)));
        } catch(e) {
            console.log(e);
        }

    }, [routerSwapContract, xaiPrice]);

    const getLatestBonusTimestamp = useCallback(async () => {
        try {

            setIsCountDown(true);
            let latestBonusTimestamp = 1709749254;
            if (contract) {
                try {
                    latestBonusTimestamp = Number((await contract.read.latestBonusTimestamp([])) as bigint); 
                } catch(e){}
            }

            const currentTimestamp = Math.ceil((new Date()).getTime() / 1000);
            const diff = currentTimestamp - latestBonusTimestamp;
            const timeLeft = diff % JACKPOT_TIME_DURATION;
            setTimeEnd(JACKPOT_TIME_DURATION - timeLeft);
        } catch(e) {
            console.log(e)
        }
    }, [timeEnd, xaiPrice]);

    const getBundle = useCallback(async() => {
        const QUERY_GET_BUNDLES_DATA = gql`
        query MyQuery {
            bundles(orderBy: round, orderDirection: desc, first: 1) {
              round
              id
              totalDistributed
              totalPlayers
            }
          }
          `;

        try {
            setTotalDistributed(0);
            setTotalWinners(0);
            setTotalPlayers(0);
            const response = await clientApolo.query({
                query: QUERY_GET_BUNDLES_DATA,
            }) as { data: { bundles: Bundle[], newTicks: Ticket[] } };
            if (response.data && response.data.bundles && response.data.bundles.length) {
                const bundle = response.data.bundles[0];
                if (bundle) {
                    const distributed = Number(formatUnits(bundle.totalDistributed.valueOf(), 18));
                    setTotalDistributed(Number(distributed.toFixed(6)));
                    setTotalWinners(Number(bundle.round));
                    setCurrentRound(Number(bundle.round));
                    setTotalPlayers(Number(bundle.totalPlayers));
                }
            }

        } catch (err) {
            console.log(err);
        }

    }, [currentRound, totalDistributed, totalPlayers, totalWinners]);


    useEffect(() => {
        setMounted(true);
    },[]);

    useEffect(() => {
        getWXaiPrice();
    },[routerSwapContract]);

    useEffect(() => {
        if (mounted) {
            getBundle();
            const bundelInterval = setInterval(getBundle, 60000);
            return () => clearInterval(bundelInterval);
            
        }
    },[mounted]);

    useEffect(() => {
        if (mounted) {
            if (timeEnd > 0) {
                const intervalId = setInterval(() => {
                    setTimeEnd(timeEnd - 1);
                  }, 1000);
                return () => clearInterval(intervalId);
            } else {
                getLatestBonusTimestamp();
            }
        }
        
      }, [timeEnd, mounted, xaiPrice]);

    return {isCountDown, currentRound, totalDistributed, currentRoundRewards: jackpotBal, totalPlayers, totalWinners, timeEnd, wxaiPrice: xaiPrice};
};