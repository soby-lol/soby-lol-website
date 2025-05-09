"use client";
import { SOCIAL_URL } from "@/types/common";
import { useState } from "react";


export default function Footer() {
    return <div className=" max-w-7xl px-5 w-full xl:px-0 mx-auto py-4 mt-16">
        <div className="flex justify-between items-center flex-col gap-5 md:flex-row">
            <div className="flex content-center items-center gap-[10px]">
                <img src="/images/logo.png" className="w-[60] h-[60px]" />
                <div className=" text-[32px] md:text-[36px] lg:text-[40px] font-normal text-brown">Soby XAI</div>
            </div>
            <div className="flex flex-col lg:flex-row gap-10 text-lg font-normal content-center justify-between">
                © 2024 Soby XAI. All rights reserved.
            </div>
            <div className="flex items-center content-center justify-center gap-[10px]">
                <a href={SOCIAL_URL.TWITTER.url} target="_blank">
                    <img src={SOCIAL_URL.TWITTER.icon} className="w-10" />
                </a>
                <a href={SOCIAL_URL.TELEGRAM.url} target="_blank">
                    <img src={SOCIAL_URL.TELEGRAM.icon} className="w-10" />
                </a>
            </div>
        </div>
    </div>
}