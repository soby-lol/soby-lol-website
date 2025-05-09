import ButtonConnect from "@/components/ButtonConnect";
import { LuckyDrawSMC } from "@/hooks/useLuckyDrawContract";
import { Ticket } from "@/types/api";
import { SOBY_GRAPHQL } from "@/types/common";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TicketLeaderboard } from "@/types/api";

type Props = {
    luckyDrawSMC?: LuckyDrawSMC
};

export default function MyTickets({ luckyDrawSMC }: Props) {
    const [mounted, setMounted] = useState(false);
    const [isSync, setIsSync] = useState(false);
    const [newTickets, setNewTickets] = useState<TicketLeaderboard[]>([]);
    const [numberOfTicket, setNumberOfTicket] = useState(0);
    const clientApolo = new ApolloClient({ uri: SOBY_GRAPHQL, cache: new InMemoryCache() });

    const { isConnected, address } = useAccount();
    const { currentRound } = luckyDrawSMC as LuckyDrawSMC;

    const loadData = useCallback(async () => {
        const QUERY_GET_NEW_TICKETS_DATA = gql`
        query MyQuery {
            leaderboards(
                orderDirection: desc
                orderBy: amountUSD
                where: {round: "${currentRound}", owner: "${address}"}
            ){
                amountUSD
                probability
                owner
                id
                round
                amount
              }
          }`;

        try {
            if (!isSync) {
                setNewTickets([]);
            }
            const response = await clientApolo.query({
                query: QUERY_GET_NEW_TICKETS_DATA,
            }) as { data: { leaderboards: TicketLeaderboard[] } };
            if (response.data && response.data.leaderboards) {
                setNewTickets(response.data.leaderboards);
            }
        } catch (err) {
            console.log(err);
        }

        setIsSync(true);
    }, [currentRound, address]);

    useEffect(() => {
        setMounted(true);
    }, [])

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, [address, currentRound]);

    useEffect(() => {
        if (newTickets.length > 0) {
            let totalTickets = 0;
            newTickets.map((t, _) => {
                const num = Number(Number(t.probability) / 100);
                if (num > 0) {
                    totalTickets += num;
                }

            });
            setNumberOfTicket(totalTickets)
        }
    }, [newTickets]);

    return <div className="w-full">
        <div className="bg-light-orange-300 py-6 px-5 rounded-3xl border-b-2 border-brown flex flex-col gap-3 h-full">
            <div className="border-b-[2px] border-[#FFE49A] text-[32px] font-bold pb-2 text-center">
                My Wallet
            </div>
            <div className="w-full flex flex-col gap-3 items-center justify-center py-10">
                <div>
                    <img src="/icons/icn-ticket.png" className="w-[30px]" />
                </div>
                {
                    isConnected ?
                        <div className="text-2xl font-bold">{numberOfTicket} Ticket(s)</div> :
                        <div className="text-lg font-bold w-full text-center">
                            Connect wallet to view your number of tickets.
                            <ButtonConnect className="mt-5 !w-full" />
                        </div>
                }

            </div>
        </div>
        <div className="text-sm font-normal text-[#C79300] flex gap-1 items-center mt-2">
            <img src="/icons/icn-info.png" className="w-[10px] h-[10px]" />
            Your ticket count will update automatically within 1 minute of your successful purchase.
        </div>
    </div>
}