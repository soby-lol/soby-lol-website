import ButtonConnect from "@/components/ButtonConnect";
import { useAppContext } from "@/providers/Context";
import { APP_LP_TOKEN, APP_SOBY_ADDRESS, APP_WETH_ADDRESS, CAMELOT_EXCHANGE_URL } from "@/types/common";
import cn from "@/utils/cn";
import { useMemo, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi"
import GuideAddLP from "./GuidAddLP";

export default function StepAddLP({ isOpenGuide, setIsOpenGuide }: { isOpenGuide: boolean, setIsOpenGuide: (flag: boolean) => void }) {
    const { isConnected, address } = useAccount();
    const { chainSupported } = useAppContext();
    const { data: LPData } = useBalance({
        address: address ?? "0x0000000000000000000000000000000000000000",
        token: APP_LP_TOKEN as any,
        watch: true,
        chainId: chainSupported.id,
    });

    const lpTokenBalance = useMemo(() => {
        if (!LPData) return 0;
        return Number(formatEther(LPData.value as any));
    }, [LPData]);

    return <div className="bg-[#FFFFE5] py-10 px-7 rounded-3xl border-b-[2px] border-brown h-full flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-4 w-full items-center content-center">
            <div className="bg-[#FFE49A] rounded-full text-2xl font-bold py-4 px-20 w-full text-center">Step 01: Add Liquidity</div>
            <div className="relative w-[80px] inline-block mt-2">
                <img src="/images/xai.png" className="w-[60px] absolute left-[40px] z-10" />
                <img src="/images/logo.png" className="w-[60px] relative z-20" />
            </div>
            <div className="text-center text-lg">Add liquidity <strong>$SOBY-$XAI</strong> pair to receive <strong>$CMLT-LP</strong></div>
        </div>
        <div className="mb-auto flex flex-col items-center justify-center gap-5 mt-5 h-full">
            <div className="text-center text-2xl font-bold">{lpTokenBalance.toFixed(6)} $CMLT-LP</div>
            <button
                className="flex gap-1 bg-[#FFFFB8] border border-[#C79300] rounded-lg px-20 py-1 underline"
                onClick={() => setIsOpenGuide(true)}
            >
                <img src="/icons/message-question.svg" />
                How to add liquidity?
            </button>
        </div>
        <div className="flex gap-4">
            <a
                href={CAMELOT_EXCHANGE_URL}
                className={cn(`mt-4 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-[transparent] hover:bg-light-orange-100 py-2 px-6 w-full disabled:opacity-50`)}
                target="_blank"
            >
                Add LP
            </a>
        </div>
        <GuideAddLP isOpen={isOpenGuide} onClose={() => { setIsOpenGuide(false) }} />
    </div>
}