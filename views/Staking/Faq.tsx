import SectionTitle from "@/components/SectionTitle";
import { LPStakingContract } from "@/hooks/useLPStakingContract";
import { APP_LP_TOKEN, CAMELOT_EXCHANGE_URL, EXPLORER_URL, SOCIAL_URL } from "@/types/common";
import cn from "@/utils/cn";
import { FormatNumber } from "@/utils/helpers";
import { Collapse, CollapseProps } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

const onCopyAddress = async (address: string) => {
  try {
    await navigator.clipboard.writeText(address);
    toast.success("Address copied");
  } catch (error) { }
};

const CamelotExchangeUrl = () => {
  return <a
    href={CAMELOT_EXCHANGE_URL}
    target="_blank"
    className="underline text-[#C79300]"
  >
    Camelot Exchange
  </a>
}

function FAQItem({ a, q, no }: { no: number; a: any; q: any }) {

  const [isShowAnwser, setIsAnwser] = useState(false);

  return (
    <div
      className={cn(
        "group p-4 flex items-start gap-3 rounded-lg hover:bg-[#FFFFE5]",
        {
          "bg-[#FFFFE5]": isShowAnwser,
        }
      )}
    >
      <div
        className="text-lg !w-8 !h-6 font-normal leading-6 text-center rounded cursor-pointer"
        onClick={() => setIsAnwser(!isShowAnwser)}
      >
        {no}
      </div>
      <div className="flex flex-col w-full text-xl font-bold gap-3 items-start justify-between">
        <div
          className="w-full leading-6 cursor-pointer text-left"
          onClick={() => setIsAnwser(!isShowAnwser)}
        >
          {q}
        </div>
        {isShowAnwser && (
          <div className={cn("text-xl font-normal text-left")}>{a}</div>
        )}
      </div>
      <div
        className={cn(
          "text-xl !w-6 !h-6 flex items-center justify-center rounded-full font-normal group-hover:bg-[#FFCA38] cursor-pointer",
          {
            "bg-[#FFCA38]": isShowAnwser,
          }
        )}
        onClick={() => setIsAnwser(!isShowAnwser)}
      >
        {isShowAnwser ? (
          <svg
            fill="#694D00"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 10.5v3h18v-3H3z"></path>
          </svg>
        ) : (
          <svg
            fill="#694D00"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 3h-3v7.5H3v3h7.5V21h3v-7.5H21v-3h-7.5V3z"></path>
          </svg>
        )}
      </div>
    </div>
  );
}

export default function StakingFaq({ action, stakingSMC }: { stakingSMC: LPStakingContract, action?: (flag: boolean) => any }) {
  const { penaltyFee, penaltyBlock, bonusEndBlock } = stakingSMC;
  const FAQs = [
    {
      q: "Where can I add LP for the $SOBY-$XAI pair?",
      a: (
        <>
          <p>
            Add liquidity for the $SOBY-$XAI pair on the <CamelotExchangeUrl />{" "} platform.
            For detailed instructions on adding liquidity, refer to the
            "<strong onClick={() => action && action(true)} className="underline text-[#C79300] cursor-pointer">
              How to add liquidity
            </strong>" guide.
          </p>
        </>
      ),
    },
    {
      q: <label className="cursor-pointer">I've successfully added liquidity, but why isn't my LP token balance updated on the <span className="text-[#C79300] cursor-pointer underline" onClick={() => window.scrollTo({ top: 0 })}>SOBY LP Staking website</span>?</label>,
      a: (
        <>
          <p>To ensure accurate LP token balance reflection on the site, please verify the following:</p>
          <ul className="list-decimal pl-5 my-4">
            <li>
              <strong>LP Pair Confirmation:</strong>{" "}
              Confirm that you've added liquidity for the $SOBY-$XAI pair.
              You can refer to the
              "<strong onClick={() => action && action(true)} className="underline text-[#C79300] cursor-pointer">
                How to add liquidity</strong>" guide for detailed instructions.
            </li>
            <li><strong>Wallet Connection:</strong> Ensure the wallet that hold the LP token is properly connected to the
              {" "}<span className="text-[#C79300] cursor-pointer underline" onClick={() => window.scrollTo({ top: 0 })}>SOBY LP Staking page</span>.{" "}
              Refresh the page and check again.</li>
            <li><strong>Time Factor:</strong> Allow some time for the LP token balance to update on the page. There might be a slight delay in synchronization.</li>
          </ul>
          <p>If you've followed these steps and still don't see your LP token balance, please contact the SOBY support team via {" "}
            <a
              href={SOCIAL_URL.TELEGRAM.url}
              className="underline text-[#C79300] cursor-pointer" target="_blank"
            >
              Telegram
            </a> for further assistance.
          </p>
        </>
      ),
    },
    {
      q: "Why can't I see the LP token in my wallet?",
      a: (
        <>
          <p>If you're unable to view the LP token in your wallet, follow these steps:</p>
          <ul className="list-decimal pl-5 my-4">
            <li>Ensure your wallet is one of the supported wallets for the XAI chain mainnet.</li>
            <li>Double-check that the wallet address you're using is the one holding the LP tokens.</li>
            <li>Once the prerequisites are met, import the following LP token address into your wallet: <br />
              <div className="flex gap-1">
                <a href={`${EXPLORER_URL}/token/${APP_LP_TOKEN}`} className="underline" target="_blank">{APP_LP_TOKEN} </a>
                <img src="/icons/copy.svg" className="cursor-pointer w-4" onClick={() => onCopyAddress(APP_LP_TOKEN)} /></div>
            </li>
          </ul>
          <p><strong>Notes:</strong> If you've followed these steps and still can't see the LP token, please contact the SOBY support team for further assistance.</p>
        </>
      ),
    },
    {
      q: "Will I be charged any fees when I unstake?",
      a: <>
        <p>Since the average block time on XAI is around 1 second, unstaking after approximately <strong>{FormatNumber(penaltyBlock)}</strong> blocks (about 7 days) from your last stake will not incur the {penaltyFee}% early unstake fee.</p>
        <p>Unstaking earlier than this timeframe will result in a {penaltyFee}% fee.</p>
      </>,
    },
    {
      q: `Can I withdraw my pending rewards after the block ${FormatNumber(bonusEndBlock)}(~30-day staking duration)?`,
      a: <>
        <p>
          Yes, you can unstake or harvest even after the block {FormatNumber(bonusEndBlock)}.
          However, it's important to note that after the block {FormatNumber(bonusEndBlock)},
          no further rewards will be accumulated. This means that any tokens you keep staked beyond the block {FormatNumber(bonusEndBlock)} will not earn additional rewards.
        </p>
      </>,
    },
    {
      q: "Where can I get help if I have a problem with SOBY Staking?",
      a: (
        <>
          <p>
            If you have a problem with SOBY Staking, you can contact the SOBY support team for assistance. You can also find helpful information and resources in the SOBY community.
          </p>
          <ul className="list-disc ml-8">
            <li>
              Twitter:{" "}
              <a
                href={SOCIAL_URL.TWITTER.url}
                target="_blank"
                className="underline cursor-pointer text-[#C79300]"
              >
                {SOCIAL_URL.TWITTER.url}
              </a>
            </li>
            <li>
              Telegram:{" "}
              <a
                href={SOCIAL_URL.TELEGRAM.url}
                target="_blank"
                className="underline cursor-pointer text-[#C79300]"
              >
                {SOCIAL_URL.TELEGRAM.url}
              </a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-7xl xl:w-full px-5 mx-auto mt-20">
      <SectionTitle title="Frequently Asked Questions" isIconBold={true} />
      <div className="flex flex-col gap-4 p-6 bg-[#FFEFC3] rounded-2xl border-b-2 border-brown">
        {FAQs.map((faq, i) => (
          <FAQItem key={i} a={faq.a} q={faq.q} no={i + 1} />
        ))}
      </div>
    </div>
  );
}
