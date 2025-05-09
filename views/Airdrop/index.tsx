"use client";
import About from "@/views/Home/About";
import Contact from "@/views/Home/Contact";
import Contract from "@/views/Home/Contract";
import Airdrop from "@/views/Home/Airdrop";
import Roadmap from "@/views/Home/Roadmap";
import ToTheMoon from "@/views/Home/ToTheMoon";
import Whitelist from "@/components/Airdrop/WhiteList";
import { APP_FORM_AIRDROP_CLAIM_ENABLE, APP_WHITELIST_ENABLE } from "@/types/common";
import cn from "@/utils/cn";
import { Suspense } from "react";
import AirdropTabs from "@/components/Airdrop/Tabs";

export default function AirdropView() {
    return <div>
        <ToTheMoon />
        {
            APP_FORM_AIRDROP_CLAIM_ENABLE &&
            < div className="relative z-30 mt-16">
                <AirdropTabs />
            </div>
        }

        <div className={cn(`pt-[30px] flex flex-col gap-[30px]`, {
            "md:bg-white-list bg-no-repeat bg-right-top": APP_WHITELIST_ENABLE,
        })} >
            {
                APP_WHITELIST_ENABLE &&
                <Suspense>
                    <Whitelist />
                </Suspense>
            }
            <About />
            <Contract />
        </div>
        <Airdrop />
        <Roadmap />
        <Contact />
    </div >
}