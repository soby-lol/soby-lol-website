"use client";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import SectionTitle from "@/components/SectionTitle";
import { LuckyDrawSMC } from "@/hooks/useLuckyDrawContract";
import { useCallback, useEffect, useState } from "react";
import { TicketLeaderboard } from "@/types/api";
import cn from "@/utils/cn";
import { SOBY_GRAPHQL } from "@/types/common";

type Props = {
    luckyDrawSMC?: LuckyDrawSMC
};

export default function TicketLeaderboard({ luckyDrawSMC }: Props) {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [ticketLeaderboard, setTicketLeaderboard] = useState<TicketLeaderboard[]>([]);
    const { currentRound } = luckyDrawSMC as LuckyDrawSMC;
    const clientApolo = new ApolloClient({ uri: SOBY_GRAPHQL, cache: new InMemoryCache() });
    const loadData = useCallback(async () => {
        const QUERY_GET_TOP_LIQ_DATA = gql`
        query MyQuery {
            leaderboards(
              orderDirection: desc
              orderBy: amountUSD
              where: {round: "${currentRound}", probability_gt: "0"}
              first: 10
              skip: ${(page - 1) * 10}
            ) {
              amountUSD
              probability
              owner
              id
              round
              amount
            }
          }
        `;

        setLoading(true);
        try {
            setTicketLeaderboard([]);
            const response = await clientApolo.query({
                query: QUERY_GET_TOP_LIQ_DATA,
            }) as { data: { leaderboards: TicketLeaderboard[] } };
            if (response.data && response.data.leaderboards) {
                setTicketLeaderboard(response.data.leaderboards);
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }

        setLoading(false);
    }, [page, currentRound]);

    useEffect(() => {
        setMounted(true);
    }, [])

    useEffect(() => {
        if (page > 0) {
            loadData();
        }
    }, [page, currentRound]);

    const Loading = () => {
        return <>
            {
                Array(5).fill(0).map((_, i) => {
                    return <tr className="h-[80px]" key={`loading-${i}`}>
                        <td className="p-5"><div className={cn("skeleton rounded-md w-full h-[70px]")} /></td>
                        <td className="p-5"><div className={cn("skeleton rounded-md w-full h-[70px]")} /></td>
                        <td className="p-5"><div className={cn("skeleton rounded-md w-full h-[70px]")} /></td>
                    </tr>
                })
            }
        </>
    }

    return <div className="max-w-7xl xl:w-full px-5 mx-auto mt-20">
        <SectionTitle title="Ticket Leaderboard" className="pb-4" />
        <p className="text-[20px] leading-[32px] text-[#694D00] font-bold text-center mb-10">
            Round #{currentRound + 1}
        </p>
        <div className="flex w-full justify-between">
            <div className="text-sm font-normal text-[#C79300] flex gap-1 items-center pb-1 float-left">
                <img src="/icons/icn-info.png" className="w-[10px] h-[10px]" />
                More tickets, more chances to win.
            </div>
            <img src="/images/icon-dog-female.png" className="mr-3 w-[60px] float-right -mt-10" />
        </div>
        <div className="flex flex-col gap-2 bg-[#FFEFC3] border-b-2 border-brown rounded-2xl overflow-hidden">
            <div className="justify-between text-2xl font-normal overflow-x-auto">
                <table className="w-full">
                    <thead className="text-[#C79300] text-2xl font-normal">
                        <tr className="h-[88px]">
                            <th className="text-left w-20 px-2 pl-8">#</th>
                            <th className="text-left px-2">Account</th>
                            <th className="text-center px-2">Tickets</th>
                            <th className="text-right px-2 pr-8">Value</th>
                        </tr>
                    </thead>
                    <tbody className="text-lg font-normal">
                        {
                            loading ?
                                <Loading /> :
                                ticketLeaderboard.map((u, i) => {
                                    return <tr className="h-[88px] cursor-pointer hover:bg-[#FFCA38]" key={`jackpot-top-${i}`}>
                                        <td className="text-left px-2 pl-8">{((page - 1) * 10) + i + 1}</td>
                                        <td className="text-left px-2">{u.owner}</td>
                                        <td className="text-center px-2">{Number(u.probability) / 100}</td>
                                        <td className="text-right px-2 pr-8">${u.amountUSD.toString()}</td>
                                    </tr>
                                })
                        }
                    </tbody>
                </table>
            </div>
        </div>
        <div className="flex gap-10 justify-center mt-10">
            <button className={cn(`border-[1px] border-[#C79300] bg-light-orange-200 h-10 leading-10 py-0 px-3 rounded bg-opacity-30`, {
                "opacity-30 cursor-not-allowed": page <= 1,
                "hover:bg-opacity-100": page > 1 
            })}
                onClick={() => page > 1 ? setPage(1) : () => { }}
            >
                Prev
            </button>
            <button className={cn(`border-[1px] border-[#C79300] bg-light-orange-200 h-10 leading-10 py-0 px-3 rounded bg-opacity-30`, {
                "opacity-30": ticketLeaderboard.length < 10,
                "hover:bg-opacity-100": ticketLeaderboard.length >= 10,
            })}
                onClick={() => {
                    if (ticketLeaderboard.length === 10) {
                        setPage(page + 1)
                    }
                }}
            >
                Next
            </button>
        </div>
    </div>
}