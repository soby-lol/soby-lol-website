"use client";

import { useLuckyDrawSMC } from "@/hooks/useLuckyDrawContract";
import cn from "@/utils/cn";
import GetYourTicket from "./GetYourTicket";
import HowToPay from "./HowToPay";
import MyTickets from "./MyTicket";
import RecentWinners from "./RecentWinners";
import Statistics from "./Statistics";
import TicketLeaderboard from "./TicketLeaderboard";
import JackpotFaq from "./Faq";
import CheckWinner from "./CheckWinner";

export function LuckyDrawView() {
    const luckyDrawSMC = useLuckyDrawSMC();
    return <div>
        <GetYourTicket luckyDrawSMC={luckyDrawSMC} />
        <div className={cn(`md:bg-white-list bg-no-repeat bg-right-top mt-4`)}>
            <HowToPay luckyDrawSMC={luckyDrawSMC} />
            <Statistics luckyDrawSMC={luckyDrawSMC} />
            <div className="max-w-7xl xl:w-full px-5 mx-auto mt-20 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MyTickets luckyDrawSMC={luckyDrawSMC} />
                <CheckWinner />
            </div>
            <RecentWinners luckyDrawSMC={luckyDrawSMC} />
            <JackpotFaq />
            <TicketLeaderboard luckyDrawSMC={luckyDrawSMC} />
        </div>
    </div>
}