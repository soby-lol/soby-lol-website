import SectionTitle from "@/components/SectionTitle";
import cn from "@/utils/cn";

export default function Airdrop() {
  const data = [
    {
      icon: "/images/arb.png",
      title: "ARB Airdrop",
      content: "Wallets that received the $ARB Airdrop.",
      no: 1,
    },
    {
      icon: "/images/xai-02.png",
      title: "XAI Airdrop",
      content: "Wallets that received the $XAI Airdrop.",
      no: 2,
    },
    {
      icon: "/images/xai.png",
      title: "XAI Sentry Nodes",
      content: "Wallets that run XAI Sentry Nodes. (TaskOn is not required)",
      no: 3,
    },
    {
      icon: "/images/spyc.png",
      title: "Soby Pirate Yacht Club NFT",
      content: "Wallets that hold SPYC NFT.",
      no: 4,
    },
    {
      icon: "/images/kaleidocube.png",
      title: "KaleidoCube NFT",
      content: "Wallets that hold KaleidoCube NFT.",
      no: 5,
    },
  ];

  const Item = ({
    icon,
    title,
    content,
    no,
  }: {
    icon: string;
    title: string;
    content: string;
    no: number;
  }) => {
    return (
      <div
        className={cn(
          `flex flex-col gap-2 py-[26px] px-[18px] bg-[#FFFFE5] hover:bg-[#FFEFC3] hover:border rounded-3xl border-b-2 border-brown w-full md:w-[300px] lg:w-[414px] max-w-full`,
          {
            "w-full md:w-[310px] lg:w-[421px]": no === 3,
          }
        )}
      >
        <div className="flex justify-between">
          <span className="text-[40px] leading-[48px] font-normal">0{no}</span>
          <img src={icon} className="w-[40px] h-[40px]" />
        </div>
        <div className="border-b-2 border-[#FFE49A] pb-2 text-[20px] leading-[28px] font-bold">
          {title}
        </div>
        <div className="text-[16px] leading-[24px] font-normal">{content}</div>
      </div>
    );
  };

  return (
    <div id="airdrop" className="mt-14">
      <img src="/images/bg-how-to-buy.png" />
      <div className="py-10px bg-[#FFE49A]">
        <div className="max-w-7xl px-5 xl:w-full xl:px-0 mx-auto py-5 pb-20">
          <SectionTitle title="$SOBY Airdrop Confirmed" isIconBold={true} />
          <div className="text-2xl font-normal text-center">
            Eligible users must participate in one of the following on-chain
            activities and complete the TaskOn Quests for the $SOBY airdrop.
          </div>
          <div className="grid gap-5 max-w-[1028px] mx-auto mt-[42px]">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
              {[data[0], data[1]].map((z, i) => (
                <Item
                  key={i}
                  title={z.title}
                  content={z.content}
                  icon={z.icon}
                  no={z.no}
                />
              ))}
            </div>
            <div className="flex justify-center items-center">
              {[data[2]].map((z, i) => (
                <Item
                  key={i}
                  title={z.title}
                  content={z.content}
                  icon={z.icon}
                  no={z.no}
                />
              ))}
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
              {[data[3], data[4]].map((z, i) => (
                <Item
                  key={i}
                  title={z.title}
                  content={z.content}
                  icon={z.icon}
                  no={z.no}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
