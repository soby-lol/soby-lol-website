"use client";

import SectionTitle from "@/components/SectionTitle";
import { LuckyDrawSMC } from "@/hooks/useLuckyDrawContract";

type Props = {
    luckyDrawSMC?: LuckyDrawSMC
};

export default function HowToPay({ luckyDrawSMC }: Props) {
    const data = [
        {
            title: "Tickets",
            content: "For every $50 spent buying $SOBY, you'll receive a lucky ticket (limited to 10 tickets per transaction).",
        },
        {
            title: "Lucky Draw",
            content: "Every 30 minutes, a winner is randomly chosen for the Jackpot, which grows by collecting 1.5% of the total buy volume. If the Jackpot reaches 150 XAI, a winner is selected. If not, it continues to grow until the next draw.",
        },
        {
            title: "Reward",
            content: "The winner of a Jackpot draw is automatically rewarded with $XAI payouts directly to their wallet without any additional charges.",
        }
    ];
    return <div id="howToPay" className="max-w-7xl px-5 xl:w-full xl:px-0 mx-auto py-4">
        <SectionTitle title="How To Play" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {
                data.map((r, i) => <div key={`how-to-buy-${i}`} className="flex flex-col gap-2 py-10 px-8 bg-[#FFEFC3] border-b-2 border-brown rounded-2xl">
                    <div className="text-2xl font-bold">{r.title}</div>
                    <div className="text-xl font-normal" dangerouslySetInnerHTML={{ __html: r.content }} />
                </div>)
            }
        </div>
    </div >
}