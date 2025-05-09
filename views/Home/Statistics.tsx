import useCoinFlipContract from "@/hooks/useCoinFlipContract";
import { useLuckyDrawSMC } from "@/hooks/useLuckyDrawContract";
import cn from "@/utils/cn";
import { FormatNumber } from "@/utils/helpers";
import { useMemo, useState } from "react";
import Marquee from "react-fast-marquee";
export default function Statistics() {
    const { totalDistributed, currentRoundRewards, totalPlayers, totalWinners } = useLuckyDrawSMC();
    const { totalFlips } = useCoinFlipContract();
    const DATA = useMemo(() => {
        return [
            {
                icon: "/icons/icn-double-ticket.png",
                label: 'Total Distributed',
                value: FormatNumber(Number(totalDistributed.toFixed(4))),
                unit: '$XAI'
            },
            {
                icon: "/icons/icn-double-ticket.png",
                label: 'Current Round Of Rewards',
                value: FormatNumber(Number(currentRoundRewards.toFixed(4))),
                unit: '$XAI'
            },
            {
                icon: "/icons/icn-double-ticket.png",
                label: 'Total Players',
                value: FormatNumber(totalPlayers),
                unit: ''
            },
            {
                icon: "/icons/icn-double-ticket.png",
                label: 'Total Winners',
                value: FormatNumber(totalWinners),
                unit: ''
            },
            {
                label: 'Total Flipped',
                value: FormatNumber(totalFlips),
                unit: 'Flips'
            }
        ]
    }, [totalDistributed, currentRoundRewards, totalPlayers, totalWinners, totalFlips])
    return <Marquee
        className="flex gap-10 rounded"
        pauseOnHover={true}
        pauseOnClick={true}
        speed={100}
    >
        <div className={cn(`flex gap-10 [&>*:nth-child(even)]:!bg-[#FFCA38]`)}>
            {
                DATA.map((item, i) => <div key={`stat-item-odd-${i}`} className="bg-[#FFEFC3] rounded-2xl py-[10px] px-[20px] flex flex-col gap-4 items-center justify-center min-w-[300px] border-b-2 border-brown cursor-pointer">
                    <div className="font-bold text-xl flex gap-4">
                        {!!item.icon && <img src="/icons/icn-double-ticket.png" className="w-8 h-8" />}
                        <span>{item.label}</span>
                    </div>
                    <span className=" text-[28px] font-normal">{item.value} {item.unit}</span>
                </div>)
            }
            {
                DATA.map((item, i) => <div key={`stat-item-even-${i}`} className="bg-[#FFEFC3] rounded-2xl py-[10px] px-[20px] flex flex-col gap-4 items-center justify-center min-w-[300px] border-b-2 border-brown  cursor-pointer">
                    <div className="font-bold text-xl flex gap-4">
                        {!!item.icon && <img src="/icons/icn-double-ticket.png" className="w-8 h-8" />}
                        <span>{item.label}</span>
                    </div>
                    <span className=" text-[28px] font-normal">{item.value} {item.unit}</span>
                </div>)
            }
        </div>
    </Marquee>
}