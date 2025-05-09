import SectionTitle from "@/components/SectionTitle";
import cn from "@/utils/cn";
import Image from "next/image";

const Stage = ({
  stageId,
  stageTitle,
  items,
}: {
  stageId: number;
  stageTitle: string;
  items: { checked: boolean; text: string }[];
}) => {
  return (
    <div
      className={cn(
        `rounded-2xl bg-[#FFF7E0] border-b-2 border-[#694D00] relative`,
        {
          "min-h-[306px]": stageId === 2,
        }
      )}
    >
      {stageId === 1 ? (
        <Image
          src="/images/icon-dog-male.png"
          alt="dog male"
          width={70}
          height={69}
          className="w-[70px] absolute top-1 left-[25px] -translate-y-full"
        />
      ) : null}

      {stageId === 6 ? (
        <Image
          src="/images/icon-dog-female.png"
          alt="dog female"
          width={70}
          height={61}
          className="w-[70px] absolute top-3 right-[24px] -translate-y-full"
        />
      ) : null}

      <div className="rounded-2xl px-4 py-2 bg-[#FFE49A]">
        <p className="text-[16px] leading-[24px] font-bold text-[#694D00]">
          Stage {stageId}:
        </p>
        <p className="text-[28px] leading-[40px] font-bold text-[#694D00]">
          {stageTitle}
        </p>
      </div>
      <div className="pt-4 pb-[20px] px-2 grid gap-3">
        {items.map((z, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Image
              src={z.checked ? "/images/check.png" : "/images/uncheck.png"}
              alt="check"
              width={24}
              height={24}
            />
            <p className="text-[18px] leading-[28px] text-[#694D00]">
              {z.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DATA = [
  {
    id: 1,
    title: "Product Beta Testing",
    items: [
      { checked: true, text: "Token Smart Contract." },
      { checked: true, text: "Token Claim Portal." },
      { checked: true, text: "SOBY Lottery Game." },
      { checked: true, text: "SOBY Yield Staking." },
      { checked: true, text: "SOBY CoinFlip Game." },
    ],
  },
  {
    id: 2,
    title: "Pre-TGE",
    items: [
      { checked: true, text: "Conduct TaskOn Quest for Airdrop." },
      {
        checked: true,
        text: "Open NFT Public Mint - Soby Pirate Yacht Club SPYC.",
      },
      { checked: true, text: "Conclude NFT Public Mint." },
      { checked: true, text: "Book Marketing Campaign." },
    ],
  },
  {
    id: 3,
    title: "Grand Opening (We're here )",
    items: [
      { checked: true, text: "SOBY FlipCoin Game dApp XAI Only." },
      { checked: true, text: "SOBY FlipCoin Telegram XAI & Arbitrum." },
      { checked: true, text: "Conduct Marketing Campaign." },
      {
        checked: true,
        text: "SOBY Swap (Powered by UniSwap. Integrated with Camelot DEX V2).",
      },
      { checked: true, text: "SOBY Token Launch." },
      { checked: true, text: "SOBY/XAI pool live." },
      { checked: true, text: "SOBY Lottery Game." },
      { checked: true, text: "Conduct SOBY Airdrop." },
      { checked: true, text: "SOBY CoinFlip Challenge Tournament." },
    ],
  },
  {
    id: 4,
    title: "Post-launch",
    items: [
      { checked: true, text: "SOBY Yield Staking." },
      { checked: false, text: "Marketing Campaign." },
      { checked: false, text: "SPYC NFT Revenue Share." },
    ],
  },
  {
    id: 5,
    title: "Extreme Decentralization",
    items: [{ checked: false, text: "Listing on series of Top 10 exchanges." }],
  },
  {
    id: 6,
    title: "Cross-chain",
    items: [
      {
        checked: false,
        text: "Fork protocol on other EVM chains, tentative candidates: Blast, Merlin, Zircuit and other OrbitL3.",
      },
      {
        checked: false,
        text: "Each forked protocol to conduct airdrop. Airdrop allocation to Pirate Yacht Club (SPYC) NFT Holder confirmed.",
      },
    ],
  },
];

export default function Roadmap() {
  return (
    <div id="roadmap" className="max-w-7xl px-5 xl:w-full xl:px-0 mx-auto py-4">
      <SectionTitle title="Roadmap" />
      <div className="grid gap-10 mt-4">
        {/* lg */}
        <div className="grid-cols-3 gap-[39px] items-start px-10 hidden lg:grid">
          {DATA.slice(0, 3).map((z, i) => (
            <Stage
              key={i}
              stageId={z.id}
              stageTitle={z.title}
              items={z.items}
            />
          ))}
        </div>
        <div className="hidden lg:grid grid-cols-3 gap-[39px] items-start px-10">
          {DATA.slice(3, 6).map((z, i) => (
            <Stage
              key={i}
              stageId={z.id}
              stageTitle={z.title}
              items={z.items}
            />
          ))}
        </div>
        {/* md */}
        <div className="grid-cols-2 gap-[39px] items-start px-10 hidden md:grid lg:hidden">
          {DATA.slice(0, 2).map((z, i) => (
            <Stage
              key={i}
              stageId={z.id}
              stageTitle={z.title}
              items={z.items}
            />
          ))}
        </div>
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-[39px] items-start px-10">
          {DATA.slice(2, 4).map((z, i) => (
            <Stage
              key={i}
              stageId={z.id}
              stageTitle={z.title}
              items={z.items}
            />
          ))}
        </div>
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-[39px] px-10 items-start">
          {DATA.slice(4, 6).map((z, i) => (
            <Stage
              key={i}
              stageId={z.id}
              stageTitle={z.title}
              items={z.items}
            />
          ))}
        </div>
        {/* sm */}
        <div className="grid md:hidden lg:hidden grid-cols-1 gap-[39px] items-start">
          {DATA.map((z, i) => (
            <Stage
              key={i}
              stageId={z.id}
              stageTitle={z.title}
              items={z.items}
            />
          ))}
        </div>
      </div>

      {/* <div className="items-center gap-0 relative hidden md:flex">
        <img src="/images/roadmap.png" />
      </div> */}
      {/* <div className=" grid grid-cols-1 sm:grid-cols-2 gap-10 md:hidden">
        {data.map((r, i) => (
          <div key={`roadmap-${i}`}>
            <div className="bg-[#FFE49A] rounded-lg text-[28px] font-bold px-2">
              {r.title}
            </div>
            <ul className="text-lg leading-7 pl-5 font-normal mt-5">
              {r.items.map((item, j) => (
                <li key={`roadmap-${i}-${j}`} className="py-1">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <img
        src="/images/roadmap-tele.png"
        className="ml-5 md:ml-[135px] mt-5 md:-mt-10"
      /> */}
    </div>
  );
}
