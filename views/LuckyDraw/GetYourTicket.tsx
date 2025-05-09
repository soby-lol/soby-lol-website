"use client";

import { LuckyDrawSMC } from "@/hooks/useLuckyDrawContract";
import cn from "@/utils/cn";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    luckyDrawSMC?: LuckyDrawSMC
};

export function Coutdown({ miliseconds }: { miliseconds: number }) {
    const hours = useMemo(() => {
        return Math.floor(miliseconds / 3600);
    }, [miliseconds]);

    const minutes = useMemo(() => {
        return Math.floor((miliseconds % 3600) / 60);
    }, [miliseconds, hours]);
    const seconds = useMemo(() => {
        return Math.floor((miliseconds % 60));
    }, [miliseconds, minutes]);

    const Value = ({ value, label }: { value: number, label: string }) => {
        return <div className="flex flex-col items-center justify-center gap-1">
            <div className="w-20 h-20 border-[1px] border-light-brown rounded-2xl bg-light-orange-200/30 leading-[80px] text-center text-[40px] font-bold">
                {value < 10 ? `0${value}` : value}
            </div>
            <label className="text-lg font-normal">{label}</label>
        </div>
    }
    return <div className="flex gap-5">
        <Value label="Hours" value={hours} />
        <Value label="Minutes" value={minutes} />
        <Value label="Seconds" value={seconds} />
    </div>
}

export default function GetYourTicket({ luckyDrawSMC }: Props) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgHeight, setImgHeight] = useState(600);
    const { timeEnd, isCountDown } = luckyDrawSMC as any;

    useEffect(() => {
        setImgHeight(imgRef.current?.height || 600);

    }, [imgRef, imgHeight])

    return <div className={cn(`relative flex flex-col justify-end bg-[#FFE49A] pb-20`)}>
        <div className="w-full relative py-40 z-10">
            <div className="max-w-[800px] px-5 w-full xl:px-0 mx-auto flex flex-col gap-10 justify-center items-center content-center">
                <div className="text-[60px] font-normal flex gap-10 items-center content-center">
                    <img src="/images/dog-gytk-left.png" className="w-[55px] h-max" />
                    <span>Get Your Tickets Now !</span>
                    <img src="/images/dog-gytk-right.png" className="w-[70px] h-max" />
                </div>
                { isCountDown && <Coutdown miliseconds={timeEnd} /> }
            </div>
        </div>
        <img ref={imgRef} src="/images/bg-get-you-ticket.png" className="max-h-full absolute bottom-0 left-0 z-0 w-full bg-[#ffffe6]" />
    </div >
}
