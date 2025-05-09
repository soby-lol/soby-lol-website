import { LuckyDrawSMC } from "@/hooks/useLuckyDrawContract";
import { Winner } from "@/types/api";
import { SOBY_GRAPHQL, EXPLORER_URL } from "@/types/common";
import cn from "@/utils/cn";
import { FormatNumber, truncateAddress } from "@/utils/helpers";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { formatUnits } from "viem";

type Props = {
    luckyDrawSMC?: LuckyDrawSMC
};

const NUMBER_OF_PAGE:number = 10;

export default function RecentWinners({ luckyDrawSMC }: Props) {
    const [mounted, setMounted] = useState(false);
    const [page, setPage] = useState(1);
    const [isSync, setIsSync] = useState(false);
    const [recentWinners, setRecentWinners] = useState<Winner[]>([]);
    const clientApolo = new ApolloClient({ uri: SOBY_GRAPHQL, cache: new InMemoryCache() });
    const loadData = useCallback(async () => {
        const QUERY_GET_RECENT_WINNERS_DATA = gql`
        query MyQuery {
            winners(orderBy: round, orderDirection: desc, first: ${NUMBER_OF_PAGE}, skip: ${(page - 1) * NUMBER_OF_PAGE}) {
              id
              bonus
              winner
              timestamp
              transactionHash
            }
        }`;

        try {
            if (!isSync) {
                setRecentWinners([]);
            }

            const response = await clientApolo.query({
                query: QUERY_GET_RECENT_WINNERS_DATA,
            }) as { data: { winners: Winner[] } };
            if (response.data && response.data.winners) {
                console.log(response.data)
                setRecentWinners(response.data.winners);
            }
            setIsSync(true)
        } catch (err) {
            console.log(err);
        }

    }, [isSync, page]);

    useEffect(() => {
        setMounted(true);
    }, [])

    useEffect(() => {
        loadData();
    }, [page]);

    return <div className="max-w-7xl xl:w-full px-5 mx-auto mt-20">
        <div className="bg-light-orange-300 py-6 rounded-3xl border-b-2 border-brown flex flex-col gap-3 h-full">
            <div className="border-b-[2px] border-[#FFE49A] text-[32px] font-bold pb-2 text-center">
                Recent Winners
            </div>
            <div className="flex flex-col gap-3 items-center justify-center">
                <table className="w-full">
                    <thead className="text-[#C79300] text-2xl font-normal">
                        <tr className="h-10">
                            <th className="text-left px-2 pl-5">Account</th>
                            <th className="text-center px-2">Rewards</th>
                            <th className="text-center px-2">Date</th>
                            <th className="text-right px-2 pr-5">Tx</th>
                        </tr>
                    </thead>
                    <tbody className="text-lg font-normal [&>*:nth-child(odd)]:bg-[#FFCA38]">
                        {
                            (recentWinners.length > 0 ? recentWinners.map((u, i) => {
                                return <tr className="h-10 cursor-pointer" key={`recent-winners-${u.winner}-${i}`}>
                                    <td className="text-left px-2 pl-5">{truncateAddress(u.winner)}</td>
                                    <td className="text-center px-2">
                                        <div className="inline-flex items-center content-center gap-2">
                                            <span>{Number(formatUnits(u.bonus.valueOf(), 18)).toFixed(6)}</span>
                                            <strong>$XAI</strong>
                                        </div>
                                    </td>
                                    <td className="text-center">{(new Date(Number(u.timestamp)*1000)).toLocaleString()}</td>
                                    <td className="text-right px-2 pr-5">
                                        <a href={`${EXPLORER_URL}/tx/${u.transactionHash}`} target="_blank" className="inline-block">
                                            <img src="/icons/icn-link.png" className="w-6 h-6" />
                                        </a>
                                    </td>
                                </tr>
                            }) :
                                <tr style={{ background: "transparent" }}>
                                    <td colSpan={4} className="text-center pt-4 font-bold">No Winners</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <div className="flex gap-4 justify-center mt-10">
                    <button className={cn(`border-[1px] border-[#C79300] bg-light-orange-200 h-10 leading-10 py-0 px-3 rounded bg-opacity-30`, {
                        "opacity-30 cursor-not-allowed": page <= 1,
                        "hover:bg-opacity-100": page > 1 
                    })}
                        onClick={() => page > 1 ? setPage(1) : () => { }}
                    >
                        Prev
                    </button>
                    <button className={cn(`border-[1px] border-[#C79300] bg-light-orange-200 h-10 leading-10 py-0 px-3 rounded bg-opacity-30`, {
                        "opacity-30": recentWinners.length < NUMBER_OF_PAGE,
                        "hover:bg-opacity-100": recentWinners.length >= NUMBER_OF_PAGE,
                    })}
                        onClick={() => {
                            if (recentWinners.length === NUMBER_OF_PAGE) {
                                setPage(page + 1)
                            }
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
}