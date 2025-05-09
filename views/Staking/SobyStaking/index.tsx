import ButtonConnect from "@/components/ButtonConnect";
import { useStakingContract } from "@/hooks/useStakingContract";
import { APP_SOBY_ADDRESS, DECIMAL } from "@/types/common";
import cn from "@/utils/cn";
import { FormatNumber, formatLargeNumber } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import StakingForm from "./StakingForm";
import UnstakeForm from "./UnstakeForm";

export default function SobyStaking() {
    const [isStaking, setIsStaking] = useState(false);
    const [isUnStaking, setIsUnStaking] = useState(false);
    const [isHarvest, setIsHarvest] = useState(false);
    const harvestRef = useRef<HTMLDivElement>(null);
    const { isConnected } = useAccount();
    const stakingSMC = useStakingContract();
    const { apr, liquidity, limitAmount, totalStaked, pendingReward, userInfo, isSubmitHarvest, onHarvest } = stakingSMC;


    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (harvestRef.current && !harvestRef.current.contains(event.target)) {
                setIsHarvest(false);
            }
        };

        if (isHarvest) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isHarvest]);

    return <div className="bg-[#FFFFE5] py-10 px-7 rounded-3xl border-b-[2px] border-brown flex flex-col justify-between h-full">
        <div className="flex flex-col justify-center gap-3 w-full items-center content-center">
            <div className="relative w-[60px] inline-block">
                <img src="/images/logo.png" className="w-[60px]" />
            </div>
            <div className="text-center text-sm font-normal">Stake & Earn: <strong className="text-lg">$SOBY</strong></div>
        </div>
        <div className="flex flex-col gap-2 mt-4 relative mb-auto">
            <div className="flex justify-between">
                <label className="text-sm font-normal">APR:</label>
                <div className="text-lg font-bold">
                    ~{FormatNumber(apr)}%
                </div>
            </div>

            {isConnected && <div className="flex justify-between">
                <label className="text-sm font-normal">Pending Rewards:</label>
                <div ref={harvestRef} className={cn("flex gap-1 items-center", {
                    "opacity-30": pendingReward <= 0
                })}>
                    <button
                        onClick={() => isConnected && pendingReward > 0 && onHarvest()}
                        className={cn(`border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:bg-light-orange-100 pl-4 pr-1 text-center h-8 leading-8 disabled:opacity-50 flex gap-2 items-center justify-center`)}
                        disabled={!isConnected || pendingReward <= 0 || isSubmitHarvest}
                    >
                        <span>{isSubmitHarvest ? 'Harvesting' : 'Harvest'}</span>
                        <span>{formatLargeNumber(pendingReward.toString())}</span>
                        <img src="/images/logo.png" className="w-6 cursor-pointer" />
                        {isSubmitHarvest && <img src="/icons/icn-spinner.svg" className="animate-spin w-5" />}
                    </button>
                </div>
            </div>
            }

            <div className="flex justify-between">
                <label className="text-sm font-normal">TVL:</label>
                <div className="text-lg font-bold">
                    ${FormatNumber(liquidity)}
                </div>
            </div>
            <div className="flex justify-between">
                <label className="text-sm font-normal">Total Staked:</label>
                <div className="text-lg font-bold">
                    {formatLargeNumber(totalStaked.toString())} $SOBY
                </div>
            </div>
            {isConnected && <div className="flex justify-between items-center bg-[#FFEFC3] rounded py-[2px] px-2">
                <label className="text-sm font-normal">My Staked:</label>
                <div className="text-lg font-bold">
                    {userInfo ? formatLargeNumber(formatUnits(userInfo.amount, DECIMAL)) : 0} $SOBY
                </div>
            </div>
            }
        </div>

        <div className="flex gap-4">
            {
                isConnected ? <>
                    {
                        userInfo && userInfo.amount > 0 &&
                        <button onClick={() => setIsUnStaking(true)} className={cn(`mt-4 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-[#FFE49A] text-brown py-2 px-6 w-full hover:border-none`)}>
                            Unstake
                        </button>
                    }
                    <button
                        onClick={() => setIsStaking(true)}
                        disabled={limitAmount <= 0}
                        className={cn(`mt-4 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 px-6 w-full disabled:opacity-50`)}>
                        {limitAmount > 0 ? 'Stake' : 'Full'}
                    </button>
                </> : <div className="mt-4 w-full"><ButtonConnect className="!w-full" /></div>
            }
        </div>

        {
            isConnected && <StakingForm
                isOpen={isStaking}
                onClose={() => { setIsStaking(false) }}
                tokenAddress={APP_SOBY_ADDRESS}
                stakingSMC={stakingSMC}
            />
        }

        {
            isConnected && userInfo && userInfo.amount > 0 && <UnstakeForm
                isOpen={isUnStaking}
                onClose={() => { setIsUnStaking(false) }}
                stakingSMC={stakingSMC}
            />
        }
    </div>
}