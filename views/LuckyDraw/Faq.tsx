import SectionTitle from "@/components/SectionTitle";
import cn from "@/utils/cn";
import { Collapse, CollapseProps } from "antd";
import { useState } from "react";

const FAQs = [
    {
        q: "What is Soby Lucky Draw?",
        a: <p>Soby Lucky Draw is an algorithm-based, open-source lottery reward game designed for the $SOBY token. It operates on principles of fairness, randomness, and decentralization.</p>
    },
    {
        q: "How Soby Lucky Draw Works?",
        a: <p>
            Players purchase SOBY by swapping the XAI/SOBY trading pair on Camelot DEX. For every $50 spent, users receive 1 ticket, with a maximum of 10 tickets per transaction. The smart contract runs continuously and randomly selects a winner every 30 minutes. The winner receives a reward in $XAI, which is 1.5% of the total buy volume accumulated during that 30-minute period.<br/>
            (Note: The 1.5% reward rate is adaptable and subject to change based on future directions and strategic needs.)
        </p>,
    },
    {
        q: "How often are the draws?",
        a: <p>
            The Jackpot draws occur every 30 minutes, provided there is at least 150 $XAI in the Jackpot.
        </p>,
    },
    {
        q: "Can I spend more than $50 to purchase SOBY tokens to get more tickets?",
        a: <p>
            Absolutely! The more SOBY tokens you acquire, the better your chances of winning. For every $50 spent on SOBY tokens, you earn 1 ticket, with a maximum of 10 tickets per swap. Feel free to make as many swaps as you'd like to increase your chances.
        </p>,
    },
    {
        q: "How do I know if I win?",
        a: <p>
            The list of winners is displayed on the website, and you can also search for winners.
        </p>,
    },
    {
        q: "How do I receive the rewards if I win?",
        a: <p>
            Winners of the Jackpot are automatically rewarded with $XAI payouts directly to their wallets without any additional charges.
        </p>,
    }, 
    {
        q: "Why didn't I receive a lucky draw ticket after selling SOBY for $50 worth of XAI?",
        a: <p>
            Remember, tickets are only awarded when you buy SOBY, not when you sell SOBY. For every $50 value in XAI that you spend to purchase SOBY, you'll receive one ticket, with a maximum of 10 tickets per swap.
        </p>,
    }, 
    {
        q: "How can I contact you with further questions?",
        a: <p>
            We encourage you to reach out to us through our Telegram channel if you have any further questions or need additional information.<br />
            Telegram: <a href="https://t.me/sobytoken" target="_blank">https://t.me/sobytoken</a>
        </p>,
    }
]

export function FAQItem({a, q, no }: {no: number, a:any, q:any}) {
    const [isShowAnwser, setIsAnwser] = useState(false);

    return <div className={cn("group p-4 flex items-start gap-3 rounded-lg hover:bg-[#FFFFE5]", {
        "bg-[#FFFFE5]": isShowAnwser    
    })}>
        <div className="text-lg !w-8 !h-6 font-normal leading-6 border-[1px] border-brown text-center rounded cursor-pointer" onClick={() => setIsAnwser(!isShowAnwser)}>
            {no}
        </div>
        <div className="flex flex-col w-full text-xl font-bold gap-3 items-start justify-between">
            <div className="w-full leading-6 cursor-pointer text-justify" onClick={() => setIsAnwser(!isShowAnwser)}>{q}</div>
            {
                isShowAnwser && <div className={cn("text-xl font-normal text-justify")}>{a}</div>
            }
        </div>
        <div className={cn("text-xl !w-6 !h-6 flex items-center justify-center rounded-full font-normal group-hover:bg-[#FFCA38] cursor-pointer", {
                "bg-[#FFCA38]": isShowAnwser
            })}
            onClick={() => setIsAnwser(!isShowAnwser)}
        >
            { isShowAnwser ? 
                <svg fill="#694D00" className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 10.5v3h18v-3H3z"></path></svg>:
                <svg fill="#694D00" className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path d="M13.5 3h-3v7.5H3v3h7.5V21h3v-7.5H21v-3h-7.5V3z"></path></svg>
            }
        </div>
    </div>
}
export default function JackpotFaq() {
    
    return <div className="max-w-7xl xl:w-full px-5 mx-auto mt-20">
        <SectionTitle title="Frequently Asked Questions" isIconBold={true} />
        <div className="flex flex-col gap-4 p-6 bg-[#FFEFC3] rounded-2xl border-b-2 border-brown">
            {
                FAQs.map((faq, i) => <FAQItem a={faq.a} q={faq.q} no={i+1} />)
            }
        </div>
    </div>
}