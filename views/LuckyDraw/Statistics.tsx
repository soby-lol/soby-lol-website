"use client";

import { LuckyDrawSMC } from "@/hooks/useLuckyDrawContract";
import { FormatNumber } from "@/utils/helpers";

type Props = {
    luckyDrawSMC?: LuckyDrawSMC
};

export default function Statistics({ luckyDrawSMC }: Props) {
    const { totalDistributed, currentRoundRewards, totalPlayers, totalWinners } = luckyDrawSMC as any;

    return <div className="max-w-7xl xl:w-full px-5 mx-auto mt-20">
        <img src="/images/icon-dog-male.png" className="ml-3 w-[60px]" />
        <div className="flex flex-col gap-2 bg-[#FFEFC3] border-b-2 border-brown rounded-3xl">
            <div className="text-[32px] font-bold text-center p-2 w-[90%] max-w-[670px] mx-auto border-b-[2px] border-[#FFE49A] my-3">Statistics</div>
            <div className="grid grid-cols-2 gap-10 md:flex md:gap-4 justify-between text-2xl font-normal p-8">
                <div className="flex flex-col gap-2 text-center">
                    <label className="text-[#C79300]">Total Distributed</label>
                    <span>{FormatNumber(totalDistributed)} $Xai</span>
                </div>
                <div className="flex flex-col gap-2 text-center">
                    <label className="text-[#C79300]">Total Players</label>
                    <span>{FormatNumber(totalPlayers)}</span>
                </div>
                <div className="flex flex-col gap-2 text-center">
                    <label className="text-[#C79300]">Total Winners</label>
                    <span>{FormatNumber(totalWinners)}</span>
                </div>
            </div>
        </div>
    </div>
}