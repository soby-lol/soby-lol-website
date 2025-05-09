/* eslint-disable @next/next/no-img-element */
import SectionTitle from "@/components/SectionTitle";
import { APP_SOBY_ADDRESS } from "@/types/common";

export default function Contract() {
  return (
    <div id="contact" className="max-w-7xl px-5 w-full xl:px-0 mx-auto py-4">
      <SectionTitle title="Official Contract" />
      <div className="text-center overflow-hidden w-full">
        <a
          className="w-full inline-block whitespace-pre underline text-2xl font-normal overflow-hidden text-ellipsis"
          href={`https://explorer.xai-chain.net/token/${APP_SOBY_ADDRESS}/token-transfers`}
          target="_blank"
        >
          {APP_SOBY_ADDRESS}
        </a>
      </div>
      <div className="mt-10">
        <p className="text-[40px] leading-[56px] text-[#C79300] font-bold text-center">
          AVAILABLE ON
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 xl:gap-20 mt-10">
          <a
            href=""
            target="_blank"
          >
            <img
              src="/images/defined.png"
              alt="defined"
              className="w-[200px] md:w-[150px] lg:w-[250px] xl:w-[347px]"
            />
          </a>

          <a
            href={``}
            target="_blank"
          >
            <img
              src="/images/blockscout.png"
              alt="blockscout"
              className="w-[200px] md:w-[150px] lg:w-[250px] xl:w-[347px]"
            />
          </a>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-[40px] leading-[56px] text-[#C79300] font-bold text-center">
          COMING SOON
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 xl:gap-20 mt-10">
          <img
            src="/images/coin-gecko.png"
            alt="coin gecko"
            className="w-[200px] md:w-[150px] lg:w-[250px] xl:w-[347px]"
          />

          <img
            src="/images/dex-screener.png"
            alt="dex screener"
            className="w-[200px] md:w-[150px] lg:w-[250px] xl:w-[347px]"
          />

          <img
            src="/images/coin-market-cap.png"
            alt="coin market cap"
            className="w-[200px] md:w-[150px] lg:w-[250px] xl:w-[347px]"
          />
        </div>
      </div>
    </div>
  );
}
