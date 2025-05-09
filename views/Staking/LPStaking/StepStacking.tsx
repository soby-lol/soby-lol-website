import ButtonConnect from "@/components/ButtonConnect";
import { useStakingContract } from "@/hooks/useStakingContract";
import { APP_LP_TOKEN, APP_SOBY_ADDRESS, DECIMAL, EXPLORER_URL } from "@/types/common";
import cn from "@/utils/cn";
import { FormatNumber, formatLargeNumber } from "@/utils/helpers";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatEther, formatUnits } from "viem";
import { useAccount } from "wagmi";
import StakingForm from "./StakingForm";
import UnstakeForm from "./UnstakeForm";
import { LPStakingContract, useLPStakingContract } from "@/hooks/useLPStakingContract";
import { Tooltip } from "antd";

export default function StepStacking({ stakingSMC }: { stakingSMC: LPStakingContract, }) {
    const [loading, setLoading] = useState(true);
    const [isStaking, setIsStaking] = useState(false);
    const [isUnStaking, setIsUnStaking] = useState(false);
    const [isHarvest, setIsHarvest] = useState(false);
    const harvestRef = useRef<HTMLDivElement>(null);
    const { isConnected } = useAccount();
    const { lpPrice, apr, tvl, totalStaked, startBlock, currentBlock, bonusEndBlock, pendingReward, userInfo, isSubmitHarvest, onHarvest } = stakingSMC;

    const isEnded = useMemo(() => {
        return bonusEndBlock < currentBlock;
    }, [bonusEndBlock, currentBlock]);

    const progress = useMemo(() => {
        const totalBlockStaking = bonusEndBlock - startBlock; // -> 100%
        const totalBlockStaked = currentBlock - startBlock;

        const percent = ((totalBlockStaked / totalBlockStaking) * 100)
        if (percent > 100) return 100;
        return Number(percent.toFixed(2))

    }, [startBlock, currentBlock, bonusEndBlock]);

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

    useEffect(() => {
        const t = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => { clearTimeout(t) }
    }, [])

    return <div className="bg-[#FFFFE5] py-10 px-7 rounded-3xl border-b-[2px] border-brown h-full flex flex-col justify-center relative">
        {
            isEnded && <span className="badge">
                Ended
            </span>
        }
        <div className="flex flex-col justify-center gap-4 w-full items-center content-center">
            <div className="bg-[#FFE49A] rounded-full text-2xl font-bold py-4 px-20 w-full text-center">Step 02: Liquid Staking</div>
            <div className={cn("relative w-[80px] inline-block mt-2")}>
                <img src="/images/xai.png" className="w-[60px] absolute left-[40px] z-10" />
                <img src="/images/logo.png" className="w-[60px] relative z-20" />
            </div>
            <div className="text-center text-lg font-normal">Stake <strong>$CMLT-LP</strong> & Earn <strong>$SOBY</strong></div>
        </div>
        <div className="flex flex-col gap-2 mt-4 relative mb-auto">
            <div className="w-full flex flex-col gap-4 mt-6">
                <div className="flex justify-between text-sm font-normal relative">
                    <div className="flex items-center gap-1">
                        <span>Start Block </span>
                        <Tooltip
                            arrow={false}
                            placement="topLeft"
                            overlayClassName="custom"
                            title={`${FormatNumber(startBlock)}`}
                        >
                            <img src="/icons/icn-info.png" className="w-[16px] h-[16px] cursor-pointer" />
                        </Tooltip>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>End Block </span>
                        <Tooltip
                            arrow={false}
                            placement="topRight"
                            overlayClassName="custom"
                            title={`${FormatNumber(bonusEndBlock)}`}
                        >
                            <img src="/icons/icn-info.png" className="w-[16px] h-[16px] cursor-pointer" />
                        </Tooltip>
                    </div>
                </div>
                <div className={cn("w-full relative h-[10px] rounded-full bg-brown")}>
                    <Tooltip
                        title={`Current Block: ${FormatNumber(currentBlock)}`}
                        color="#71633D"
                        overlayClassName="custom"
                    >
                        <div className="absolute -bottom-[5px] bg-[#FFCA38] p-[2px] w-[20px] h-[20px] rounded-full z-30 cursor-pointer flex justify-center items-center" style={{ left: progress > 2 ? `calc(${progress}% - 20px)` : `${progress}%` }}>
                            <span className="block w-[10px] h-[10px] border-[1px] border-brown rounded-full"></span>
                        </div>
                    </Tooltip>

                    <div style={{ width: progress + "%" }} className={cn("bg-[#FFCA38] h-[10px] rounded-full absolute top-0 left-0")}></div>
                </div>
            </div> {/** end progress */}

            <div className="flex items-center justify-between mt-4">
                <label className="text-sm font-normal">APR:</label>
                <div className="text-lg font-bold">
                    ~{FormatNumber(Number(apr.toFixed(2)))}%
                </div>
            </div>
            {isConnected && <div className="flex items-center justify-between">
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

            <div className="flex justify-between items-center pr-2">
                <label className="text-sm font-normal">TVL:</label>
                <span className="text-lg font-bold">${FormatNumber(totalStaked * lpPrice)}</span>
            </div>
            <div className="flex justify-between items-center pr-2">
                <label className="text-sm font-normal">Total Staked Amount:</label>
                <div className="text-lg font-bold">
                    {FormatNumber(Number(totalStaked.toFixed(6)))}{" "}
                    <a href={`${EXPLORER_URL}/token/${APP_LP_TOKEN}`} target="_blank" className="underline">$CMLT-LP</a>
                </div>
            </div>
            {isConnected && <div className="flex justify-between items-center bg-[#FFEFC3] rounded py-[2px] px-2">
                <label className="text-sm font-normal">My Staked Amount:</label>
                <div className="text-lg font-bold flex gap-2">
                    {FormatNumber(userInfo ? Number(formatEther(userInfo.amount)) : 0)} {" "}
                    <a href={`${EXPLORER_URL}/token/${APP_LP_TOKEN}`} target="_blank" className="underline">$CMLT-LP</a>
                </div>
            </div>
            }
        </div>

        <div className="flex gap-4">
            {
                isConnected ? <>
                    {
                        userInfo && userInfo.amount > 0 &&
                        <button onClick={() => setIsUnStaking(true)} className={cn(`mt-4 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-[#FFE49A] text-brown py-2 px-6 w-full hover:border-[transparent]`)}>
                            Unstake
                        </button>
                    }
                    {
                        !isEnded && !loading && <button
                            disabled={isEnded}
                            onClick={() => setIsStaking(true)}
                            className={cn(`mt-4 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-[transparent] hover:bg-light-orange-100 py-2 px-6 w-full disabled:opacity-50`)}>
                            {isEnded ? "Ended" : "Stake"}
                        </button>
                    }
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