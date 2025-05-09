"use client";
import { SOCIAL_URL, JACKPOT_URL, SWAP_URL, COINFLI_URL } from "@/types/common";
import cn from "@/utils/cn";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ButtonConnect from "../ButtonConnect";
import Link from "next/link";
const menus = [
  { name: "Airdrop", link: "/airdrop/" },
  { name: "Lucky-draw", link: JACKPOT_URL, isExternal: true },
  { name: "Swap", link: SWAP_URL, isExternal: true },
  { name: "LP Staking", link: "/staking/", isSoon: false },
  { name: "Roadmap", link: "/#roadmap" },
  { name: "CoinFlip", link: COINFLI_URL, isExternal: true },
  {
    name: "Documentation",
    link: "https://sobytoken.gitbook.io/soby-xai/project-information/introduction",
    isExternal: true,
  },
];

export default function Header() {
  const [isToggle, setIsToggle] = useState(false);
  const path = usePathname();
  return (
    <div className="max-w-7xl px-5 w-full xl:px-0 mx-auto py-4">
      <div className="flex justify-between items-center content-center">
        <Link href="/" className="flex content-center items-center gap-[10px]">
          <img
            src="/images/logo.png"
            className="w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
          />
          <div className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-normal text-brown">
            Soby XAI
          </div>
        </Link>
        <div className="hidden lg:flex gap-10 text-lg md:text-xl lg:text-2xl font-normal content-center justify-between">
          {menus.map((m, i) => (
            <Link
              key={`nav-desk-${i}`}
              href={m.isSoon ? "#" : m.link}
              title={m.name}
              target={m.isExternal ? "_blank" : "_self"}
              className={cn("text-lg relative", {
                "border-b-[2px] border-[#C79300]": path === m.link,
              })}
            >
              <span
                className={cn({
                  "opacity-75": m.isSoon,
                })}
              >
                {m.name}
              </span>
              {m.isSoon && (
                <span className="text-xs absolute -right-1 -top-3 bg-[#FFCA38] px-1 rounded text-brown">
                  Coming Soon
                </span>
              )}
            </Link>
          ))}
        </div>
        <div className="flex items-center content-center justify-center gap-[10px]">
          <a
            href={SOCIAL_URL.TWITTER.url}
            target="_blank"
            className="hidden md:block"
          >
            <img src={SOCIAL_URL.TWITTER.icon} className="w-10" />
          </a>
          <ButtonConnect />
          <div
            className={cn("hambuger block lg:hidden", { active: isToggle })}
            onClick={() => setIsToggle(!isToggle)}
          >
            <span></span>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex transition-all opacity-0 h-0 flex-col gap-4 items-end bg-brown rounded text-[#FFF] mt-5 lg:hidden",
          {
            "flex h-auto opacity-100 p-5": isToggle,
          }
        )}
      >
        {menus.map((m, i) => (
          <a
            key={`nav-mobile-${i}`}
            href={m.link}
            title={m.name}
            target={m.isExternal ? "_blank" : "_self"}
          >
            {m.name}
          </a>
        ))}
      </div>
    </div>
  );
}
