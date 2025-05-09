import { APP_SOBY_ADDRESS, APP_WETH_ADDRESS, CAMELOT_EXCHANGE_URL } from "@/types/common";
import cn from "@/utils/cn";
import { useState } from "react";

const CamelotExchangeUrl = () => {
    return <a
        href={CAMELOT_EXCHANGE_URL}
        target="_blank"
        className="underline text-[#C79300]"
    >
        Camelot Exchange
    </a>
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const STEPS = [
    {
        no: 1,
        title: <>
            Visit the <CamelotExchangeUrl /> website and enter the amount of $XAI and $SOBY you want to add for liquidity.
        </>,
        img: "/images/step-1-add-lp.png",
    },
    {
        no: 2,
        title: <>
            Click Appove $SOBY button
        </>,
        note: <>Assuming you have already approved SOBY token on {" "} <CamelotExchangeUrl />, skip to step 3.</>,
        img: "/images/step-2-add-lp.png",
    },
    {
        no: 3,
        title: <>
            Click Add Liquidity and Sign Transaction in your connected wallet.
        </>,
        note: <>After successfully adding liquidity the $SOBY- $XAI pair and received the $CMTL-LP, please navigate back to the <strong>SOBY LP Staking</strong> page and proceed with the Liquid Staking step.</>,
        img: "/images/step-3-add-lp.png",
    },
];

export default function GuideAddLP({ isOpen, onClose }: Props) {
    const [currentStep, setCurrentStep] = useState(0);

    const onNextStep = () => {
        if (currentStep + 1 < STEPS.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const onPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    if (!isOpen) return <></>

    const Step = ({ step }: { step: any }) => {
        return <div className={cn("flex flex-col items-center justify-center gap-4 text-xl w-full", {
            "hidden": currentStep !== Number(step.no) - 1
        })}
        >
            <div className={cn("text-left w-full")}>
                <strong>Step {step.no}:</strong> {step.title}
                {!!step.note && <p className="text-base text-[#C79300] mt-2">
                    <strong>Note:</strong> {step.note}
                </p>
                }
            </div >
            <img src={step.img} className="w-full max-w-[20vw]" />
        </div>
    }

    return <div className="fixed inset-0 bg-[#000] bg-opacity-30 flex justify-center items-center top-0 left-0 z-50">
        <div className="w-[90%] max-w-[800px] max-h-[80vh] bg-[#FFFFE5] py-10 px-7 rounded-3xl shadow-xl transition-transform transform-gpu scale-110 animate-zoomOut flex flex-col gap-3 border-b-[2px] border-brown">
            <div onClick={() => onClose()} className='absolute top-10 right-7 w-[36px] h-[36px] flex justify-end items-center cursor-pointer'>
                <img src="/icons/icn-close.svg" />
            </div>
            <div className="flex flex-col gap-4 items-left">
                <div className="text-2xl font-bold">How to add liquidity?</div>
                <div className="bg-[#FFE49A] w-full h-[2px]"></div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 text-xl">
                {STEPS.map((_, i) =>
                    <Step key={`step-${i}`} step={STEPS[i]} />
                )}
                <div className="flex gap-2 mt-4">
                    {STEPS.map((_, i) =>
                        <span key={`page - step - ${i} `} className={cn("bg-[#FFCA38] w-2 h-2 rounded-full cursor-pointer", {
                            "w-[30px] bg-[#694D00]": currentStep === i
                        })}
                            onClick={() => setCurrentStep(i)}
                        />
                    )}
                </div>
            </div>
            <div className="w-full flex gap-4 mt-4">
                <button
                    disabled={currentStep === 0 || STEPS.length <= 1}
                    onClick={onPrevStep}
                    className={cn("w-full disabled:opacity-50 border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 h-10 leading-10 flex items-center justify-center gap-2", {

                    })}
                >
                    Back
                </button>
                <button
                    disabled={currentStep + 1 >= STEPS.length}
                    onClick={onNextStep}
                    className={cn("w-full disabled:opacity-50 border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 h-10 leading-10 flex items-center justify-center gap-2", {

                    })}
                >
                    Next
                </button>
            </div>
        </div>
    </div>
}