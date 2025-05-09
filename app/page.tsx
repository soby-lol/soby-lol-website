"use client";
import About from "@/views/Home/About";
import Mint from "@/views/Home/Mint";
import Contact from "@/views/Home/Contact";
import Contract from "@/views/Home/Contract";
import Airdrop from "@/views/Home/Airdrop";
import Roadmap from "@/views/Home/Roadmap";
import ToTheMoon from "@/views/Home/ToTheMoon";
import Whitelist from "@/components/Airdrop/WhiteList";
import { APP_FORM_AIRDROP_CLAIM_ENABLE, APP_MINT_SOBY_NFT_ENABLE, APP_WHITELIST_ENABLE } from "@/types/common";
import cn from "@/utils/cn";
import { Suspense } from "react";
import AirdropTabs from "@/components/Airdrop/Tabs";
import TaxBurn from "@/views/Home/TaxBurn";
import BurnStatistics from "@/views/Home/BurnStatistics";
import Statistics from "@/views/Home/Statistics";
import Euro from "@/views/Home/Euro";

export default function Home() {
  return <main>
    <ToTheMoon />
    <Euro />
    <div className="max-w-7xl xl:w-full px-5 mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <TaxBurn />
      <BurnStatistics />
    </div>
    <div className="w-full px-5 mx-auto mt-20">
      <Statistics />
    </div>
    <div className={cn(`pt-[30px] flex flex-col gap-[30px] mt-10`)} >
      <About />
      {APP_MINT_SOBY_NFT_ENABLE ? <Mint /> : <></>}
      <Contract />
    </div>
    <Airdrop />
    <Roadmap />
    <Contact />
  </main>;
}
