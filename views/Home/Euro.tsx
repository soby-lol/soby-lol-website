import SectionTitle from "@/components/SectionTitle";
import { COINFLI_URL } from "@/types/common";
import Link from "next/link";

const Euro = () => {
  return (
    <div id="contact" className="max-w-7xl px-5 w-full xl:px-0 mx-auto py-4">
      <SectionTitle title="Mystery Box & NFTs" />
      <div className="rounded-[24px] bg-[#FFEFC3] border-b-2 border-[#694D00] p-[20px] grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-[145px] xl:gap-[185px] relative mt-[80px] xl:mt-[100px]">
        <img src="/images/euro-banner.png" alt="euro banner" className="hidden lg:block w-[115px] xl:w-[145px] absolute left-1/2 -translate-x-1/2 -top-10" />
        <Link href={`${COINFLI_URL}euro/team-management/?t=box`} className="pt-10 pb-5 px-[28px] rounded-[24px] bg-[#FFFFE5] hover:bg-[#FFCA38]/30 transition-all">
          <img
            src="/images/mystery-box.png"
            alt="mystery box"
            className="w-[200px] xl:w-[283px] mx-auto"
          />
          <p className="text-[32px] leading-[40px] font-bold text-[#694D00] pb-2 border-b border-[#FFE49A] mt-4">
            Soby Mystery Box
          </p>
          <p className="text-[24px] leading-[32px] text-[#694D00]">
            Open a Mystery Box & get a random surprise SOBY EURO NFTs
          </p>
        </Link>
        <Link href={`${COINFLI_URL}euro/team-management/?t=nft`} className="pt-10 pb-5 px-[28px] rounded-[24px] bg-[#FFFFE5] hover:bg-[#FFCA38]/30 transition-all">
          <img
            src="/images/euro-card.png"
            alt="euro cards"
            className="w-[236px] xl:w-[338px] mx-auto"
          />
          <p className="text-[32px] leading-[40px] font-bold text-[#694D00] pb-2 border-b border-[#FFE49A] mt-4">
            SOBY EURO NFTs
          </p>
          <p className="text-[24px] leading-[32px] text-[#694D00]">
            24 unique NFTs for 24 nations in the EURO. Collect 24 NFTs to unlock
            a prizes pool up to $1000
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Euro;
