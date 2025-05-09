import { LPStakingContract } from "@/hooks/useLPStakingContract";
import { useAppContext } from "@/providers/Context";
import { APP_LP_TOKEN } from "@/types/common";
import cn from "@/utils/cn";
import { FormatNumber } from "@/utils/helpers";
import { Tooltip } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    tokenAddress: string;
    stakingSMC: LPStakingContract;
};

export default function StakingForm({ isOpen, onClose, tokenAddress, stakingSMC }: Props) {
    const [amountStakingInput, setAmountStaking] = useState('0');
    const [error, setError] = useState('');
    const { chainSupported } = useAppContext();
    const { lpBalance,
        bonusEndBlock,
        lpPrice,
        sobyPrice,
        totalStaked,
        apr,
        isSubmitStaking,
        onDeposit,
        penaltyFee,
        penaltyBlock,
        latestDepositBlock,
        currentBlock } = stakingSMC;

    const { address } = useAccount();

    const amountStaking = useMemo(() => {
        if (!amountStakingInput) return 0;
        const value = Number(amountStakingInput.replace(/,/g, ''));
        if (isNaN(value)) return 0;
        if (value > lpBalance) return lpBalance;

        if (value < 0) return 0;
        return value;

    }, [amountStakingInput, lpBalance]);

    const onChangeAmountStaking = (e: any) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        const value = e.target.value;
        if (regex.test(value)) {
            setError("");
            setAmountStaking(value);
            const amount = parseFloat(value.replace(/,/g, ''));
            if (isNaN(amount)) {
                setError("Amount invalid");
                return;
            }
            if (amount > lpBalance) {
                setError("Not enough balance");
                return;
            }

            if (amount < 0) {
                setError(`The amount must be greater than > 0`);
                return;
            };
        }
    }

    const onStaking = useCallback(async () => {
        const amount = formatEther(parseEther(amountStaking.toFixed(18)));
        await onDeposit(amount);
        onClose();
    }, [amountStaking]);

    if (!isOpen) return <></>;

    return (
        <div className="fixed inset-0 bg-[#000] bg-opacity-30 flex justify-center items-center top-0 left-0 z-50">
            <div className="w-[90%] max-w-[650px] bg-[#FFFFE5] py-10 px-7 rounded-3xl shadow-xl transition-transform transform-gpu scale-110 animate-zoomOut flex flex-col gap-3 border-b-[2px] border-brown">
                <div onClick={() => onClose()} className='absolute top-10 right-7 w-[36px] h-[36px] flex justify-end items-center cursor-pointer'>
                    <img src="/icons/icn-close.svg" />
                </div>
                <div className="flex gap-4 items-center content-center">
                    <img src="/images/logo.png" className="w-[60px]" />
                    <div className="text-2xl font-bold">Staking $CMLT-LP</div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between w-full items-center content-center">
                        <label className="text-sm">Stake Amount</label>
                        <div className="flex gap-[10px] w-max">
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setAmountStaking(
                                    formatEther(parseEther((lpBalance * 0.25).toFixed(18)))
                                )}
                            >
                                25%
                            </button>
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setAmountStaking(
                                    formatEther(parseEther((lpBalance * 0.50).toFixed(18)))
                                )}
                            >
                                50%
                            </button>

                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setAmountStaking(
                                    formatEther(parseEther((lpBalance * 0.75).toFixed(18)))
                                )}
                            >
                                75%
                            </button>
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setAmountStaking(
                                    formatEther(parseEther((lpBalance).toFixed(18)))
                                )}
                            >
                                Max
                            </button>
                        </div>
                    </div>
                    <div className={cn("w-full p-4 bg-[#FFE49A] flex gap-1 items-center rounded-xl border-b-[2px] border-[#FFE49A] relative", {
                        "border-[#e82b2b]": !!error
                    })}>
                        <input type="text"
                            className={cn(`w-full border-none text-[28px] leading-10 font-bold bg-[#FFE49A] h-[40px] outline-none`)}
                            disabled={false}
                            onChange={onChangeAmountStaking}
                            value={amountStakingInput}
                        />
                        <div className="text-[28px] w-[150px] font-bold self-end">$CMLT-LP</div>
                    </div>
                    <div className="flex justify-between items-center -mt-2">
                        {
                            !!error ? <div className="text-[#e82b2b] text-sm font-bold">
                                * {error}
                            </div> : <div></div>
                        }
                        <div className="text-sm text-right">
                            Balance: {FormatNumber(lpBalance)}  $CMLT-LP
                        </div>
                    </div>

                    <div className="h-[2px] bg-[#FFE49A] w-full" />
                    <div>
                        <label className="text-sm">Position Overview</label>
                        <div className="bg-[#BF8D00] rounded-3xl py-6 px-7 flex flex-col gap-4 mt-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-[#FFFFE5]">APR:</label>
                                <span className="text-lg text-[#FFFFE5]">{FormatNumber(Number(apr.toFixed(2)))}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-[#FFFFE5]">Current Block:</label>
                                <span className="text-lg text-[#FFFFE5]">{FormatNumber(currentBlock)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-[#FFFFE5]">End at Block:</label>
                                <span className="text-lg text-[#FFFFE5]">{FormatNumber(bonusEndBlock)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-[#FFFFE5] flex gap-2 items-center relative">
                                    <span>Early UnStake Fee:</span>
                                    <Tooltip
                                        arrow={false}
                                        placement="topLeft"
                                        title={
                                            <div className="flex p-2 flex-col gap-3 text-brown rounded-lg border-[1px] border-brown bg-[#FFEFC3] w-auto md:w-[320px]">
                                                <label className="text-sm font-bold">Early Unstake Fee: {penaltyFee}% of the unstake amount.</label>
                                                <div className="text-xs font-normal">
                                                    The fee you will be charged if you unstake before block <strong>{FormatNumber(penaltyBlock + latestDepositBlock)}</strong> (approximately 7 days from your last stake).
                                                </div>
                                            </div>
                                        }
                                    >
                                        <img src="/icons/icn-info-light.svg" className="w-[16px] h-[16px]" />
                                    </Tooltip>
                                </div>
                                <span className="text-lg font-bold text-[#FFFFE5]">{penaltyFee}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <button
                        disabled={bonusEndBlock <= currentBlock || amountStaking <= 0 || isSubmitStaking || lpBalance <= 0 || !!error}
                        onClick={() => amountStaking > 0 && !isSubmitStaking && onStaking()}
                        className={cn("w-full disabled:opacity-50 border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 h-10 leading-10 flex items-center justify-center gap-2", {

                        })}
                    >
                        {bonusEndBlock <= currentBlock ?
                            <span>Ended</span> :
                            <span>{isSubmitStaking ? 'Staking' : (lpBalance > 0 ? 'Stake' : (lpBalance > 0 ? 'Full' : 'Stake'))}</span>}

                        {isSubmitStaking && <img src="/icons/icn-spinner.svg" className="animate-spin w-5" />}
                    </button>
                </div>
            </div>
        </div >
    );
}