"use client";
import SectionTitle from "@/components/SectionTitle";
import { useStakingContract } from "@/hooks/useStakingContract";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import SobyStaking from "./SobyStaking";
import LPStaking from "./LPStaking";
import StakingFaq from "./Faq";
import { toast } from "react-toastify";
import { APP_LP_TOKEN } from "@/types/common";
import { useLPStakingContract } from "@/hooks/useLPStakingContract";

export default function StakingView() {
    const [isOpenGuide, setIsOpenGuide] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgHeight, setImgHeight] = useState(600);
    const stakingSMC = useLPStakingContract();

    useEffect(() => {
        setImgHeight(imgRef.current?.height || 600);

    }, [imgRef, imgHeight])

    const ComingSoon = () => {
        return <div className="w-full relative py-40 z-10">
            <div className="max-w-[800px] px-5 w-full xl:px-0 mx-auto flex flex-col gap-10 justify-center items-center content-center">
                <div className="text-[60px] font-normal flex gap-10 items-center content-center">
                    <img src="/images/dog-gytk-left.png" className="w-[55px] h-max" />
                    <span>Coming Soon !</span>
                    <img src="/images/dog-gytk-right.png" className="w-[70px] h-max" />
                </div>
            </div>
        </div>
    }

    const onCopyAddress = async (address: string) => {
        try {
            await navigator.clipboard.writeText(address);
            toast.success("Address copied")
        } catch (error) { }
    }


    return <><div className={cn(`relative flex flex-col justify-end bg-[#FFE49A] pb-20`)}>
        <div className="w-full relative py-10 z-10 max-w-7xl xl:w-full px-5 mx-auto">
            <SectionTitle title="Staking LP to Earn $SOBY" isIconBold={true} />
            <p className="text-2xl font-normal text-center">The place to stake your LP tokens, keep them liquid, and earn rewards.</p>
            <div className="mt-10">
                <LPStaking isOpenGuide={isOpenGuide} setIsOpenGuide={setIsOpenGuide} stakingSMC={stakingSMC} />
            </div>
        </div>
        <img ref={imgRef} src="/images/bg-get-you-ticket.png" className="max-h-full absolute bottom-0 left-0 z-0 w-full bg-[#ffffe6]" />
    </div>
        <StakingFaq action={setIsOpenGuide} stakingSMC={stakingSMC} />
    </>
}