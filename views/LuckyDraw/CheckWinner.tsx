import { Winner } from "@/types/api";
import { EXPLORER_URL, SOBY_GRAPHQL } from "@/types/common";
import cn from "@/utils/cn";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useCallback, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

export const NotWin = ({ onCheckWinner, isChecking }: { onCheckWinner: () => void, isChecking: boolean }) => {
    return <div className="flex flex-col gap-6 justify-between items-center h-full">
        <div className="w-full border-b-[2px] border-[#FFE49A] text-[32px] font-bold pb-2 text-center">
            No prizes to collect...
        </div>
        <div className="flex flex-col gap-2 items-center justify-center h-full">
            <p className="text-center text-2xl ">Better luck next time!</p>
            <button
                className={cn("w-max border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 hover:py-[9px] px-10 gap-2 mt-4", {
                    "opacity-50": isChecking
                })}
                disabled={isChecking}
                onClick={onCheckWinner}
            >
                {isChecking ? "Checking" : "Re-check"}
            </button>
        </div>
    </div>
}

export const Check = ({ onCheckWinner, isChecking }: { onCheckWinner: () => void, isChecking: boolean }) => {
    return <div className="flex flex-col gap-6 justify-between items-center h-full">
        <div className="w-full border-b-[2px] border-[#FFE49A] text-[32px] font-bold pb-2 text-center">
            Are you a winner?
        </div>
        <div className="flex items-center justify-center h-full">
            <button
                className={cn("w-max border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 hover:py-[9px] px-10 gap-2", {
                    "opacity-50": isChecking
                })}
                disabled={isChecking}
                onClick={onCheckWinner}
            >
                {isChecking ? "Checking" : "Check Now"}
            </button>
        </div>
    </div>
}

const WinnersResult = ({ winners }: { winners: Winner[] }) => {
    return <div className="w-full">
        <div className="bg-light-orange-300 rounded-3xl flex flex-col gap-3 h-full">
            <div className="border-b-[2px] border-[#FFE49A] text-[32px] font-bold pb-2 text-center">
                Your Win
            </div>
            <div className="flex flex-col gap-3 items-center justify-center mt-5">
                <table className="w-full">
                    <thead className="text-[#C79300] text-2xl font-normal">
                        <tr className="h-10">
                            <th className="text-left px-2 pl-5">Round</th>
                            <th className="text-center px-2">Rewards</th>
                            <th className="text-center px-2">Date</th>
                            <th className="text-right px-2 pr-5">Tx</th>
                        </tr>
                    </thead>
                    <tbody className="text-lg font-normal [&>*:nth-child(odd)]:bg-[#FFCA38]">
                        {
                            winners.map((u, i) => {
                                return <tr className="h-10 cursor-pointer" key={`recent-winners-${u.winner}-${i}`}>
                                    <td className="text-left px-2 pl-5">#{Number(u.round) + 1}</td>
                                    <td className="text-center px-2">
                                        <div className="inline-flex items-center content-center gap-2">
                                            <span>{Number(formatUnits(u.bonus.valueOf(), 18)).toFixed(4)}</span>
                                            <strong>$XAI</strong>
                                        </div>
                                    </td>
                                    <td className="text-center">{(new Date(Number(u.timestamp) * 1000)).toLocaleString()}</td>
                                    <td className="text-right px-2 pr-5">
                                        <a href={`${EXPLORER_URL}/tx/${u.transactionHash}`} target="_blank" className="inline-block">
                                            <img src="/icons/icn-link.png" className="w-6 h-6" />
                                        </a>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export default function CheckWinner() {
    const [winners, setWinners] = useState<Winner[]>([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const clientApolo = new ApolloClient({ uri: SOBY_GRAPHQL, cache: new InMemoryCache() });
    const { address } = useAccount();
    const onCheckWinner = useCallback(async () => {
        const QUERY_GET_RECENT_WINNERS_DATA = gql`
        query MyQuery {
            winners(
                where: {winner: "${address}"}
                orderBy: round
                orderDirection: desc
                first: 20
            ) {
                bonus
                blockNumber
                id
                round
                tickId
                timestamp
                transactionHash
                winner
            }
        }`;

        try {
            setIsChecking(true);
            setWinners([]);
            const response = await clientApolo.query({
                query: QUERY_GET_RECENT_WINNERS_DATA,
            }) as { data: { winners: Winner[] } };
            if (response.data && response.data.winners) {
                setWinners(response.data.winners);
            }
        } catch (err) {
            console.log(err);
        }
        setIsChecked(true);
        setIsChecking(false);

    }, [winners, isChecked, isChecking]);


    return <div className="w-full mt-[50px] lg:mt-0">
        <div className={cn("bg-light-orange-300 py-6 px-5 rounded-3xl border-b-2 border-brown flex flex-col gap-3 h-full")}>
            {isChecked && winners.length === 0 && <NotWin onCheckWinner={onCheckWinner} isChecking={isChecking} />}
            {!isChecked && <Check onCheckWinner={onCheckWinner} isChecking={isChecking} />}
            {isChecked && winners.length > 0 && <WinnersResult winners={winners} />}
        </div>
    </div>
}