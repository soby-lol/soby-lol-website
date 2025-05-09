import { APP_LP_TOKEN, DECIMAL, EXPLORER_URL } from "@/types/common";
import cn from "@/utils/cn";
import { FormatNumber } from "@/utils/helpers";
import { useCallback, useMemo, useState } from "react";
import { formatEther, parseEther, parseUnits } from "viem";
import { Tooltip } from "antd";
import { LPStakingContract } from "@/hooks/useLPStakingContract";
import { useAccount, useBalance } from "wagmi";
import { useAppContext } from "@/providers/Context";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    stakingSMC: LPStakingContract;
};

export default function UnStakeForm({ isOpen, onClose, stakingSMC }: Props) {
    const { address } = useAccount();
    const { chainSupported } = useAppContext()

    const [isConfirmUnstake, setIsConfirmUnstake] = useState(false);
    const [unstakeAmountInput, setUnstakeAmount] = useState('0');
    const [error, setError] = useState('');
    const { lpBalance, userInfo, penaltyFee, penaltyBlock, currentBlock, latestDepositBlock, onWithdraw, withdrawable, isSubmitWithdraw, pendingReward } = stakingSMC;

    const userAmountStaked = useMemo(() => {
        if (userInfo) {
            return Number(formatEther(userInfo.amount));
        }
        return 0;
    }, [userInfo]);

    const unstakeAmount = useMemo(() => {
        if (!unstakeAmountInput) return 0;
        const value = Number(unstakeAmountInput.replace(/,/g, ''));
        if (isNaN(value)) return 0;
        if (value > userAmountStaked) return userAmountStaked;

        if (value < 0) return 0;
        return value;

    }, [unstakeAmountInput, userAmountStaked]);

    const penaltyFeeAmount = useMemo(() => {
        if (penaltyFee > 0 && !withdrawable) {
            return (unstakeAmount * penaltyFee) / 100;
        }
        return 0;
    }, [penaltyFee, unstakeAmount]);

    const withdrawAmountAfterFee = useMemo(() => {
        if (unstakeAmount < penaltyFeeAmount) return 0;
        return unstakeAmount - penaltyFeeAmount;
    }, [unstakeAmount, pendingReward, penaltyFeeAmount])

    const onChangeAmountStaking = (e: any) => {
        setError("");
        const regex = /^[0-9]*\.?[0-9]*$/;

        if (regex.test(e.target.value)) {
            setUnstakeAmount(e.target.value);
            const value = Number(e.target.value.replace(/,/g, ''));
            if (isNaN(value)) {
                setError("Amount invalid");
            }
            if (value > userAmountStaked) {
                setError(`The amount must be less than ${FormatNumber(userAmountStaked)}`);
            }

            if (value < 0) {
                setError(`The amount must be greater than > 0`);
            };
        }
    }

    const onUnStaking = useCallback(async () => {
        const amount = formatEther(parseEther(unstakeAmount.toFixed(18)));
        await onWithdraw(parseEther(amount));
        onClose();
    }, [unstakeAmount]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#000] bg-opacity-30 flex justify-center items-center top-0 left-0 z-50">
            <div className="w-[90%] max-w-[650px] bg-[#FFFFE5] py-10 px-7 rounded-3xl shadow-xl transition-transform transform-gpu scale-110 animate-zoomOut flex flex-col gap-3 border-b-[2px] border-brown">
                <div onClick={() => onClose()} className='absolute top-10 right-7 w-[36px] h-[36px] flex justify-end items-center cursor-pointer'>
                    <img src="/icons/icn-close.svg" />
                </div>
                <div className="flex gap-4 items-center content-center">
                    <img src="/images/logo.png" className="w-[60px]" />
                    <div className="text-2xl font-bold">Unstake $CMLT-LP</div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between w-full items-center content-center">
                        <label className="text-sm">Amount</label>
                        <div className="flex gap-[10px] w-max">
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setUnstakeAmount(
                                    formatEther(parseEther((userAmountStaked * 0.25).toFixed(18)))
                                )}
                            >
                                25%
                            </button>
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setUnstakeAmount(
                                    formatEther(parseEther((userAmountStaked * 0.5).toFixed(18)))
                                )}
                            >
                                50%
                            </button>

                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setUnstakeAmount(
                                    formatEther(parseEther((userAmountStaked * 0.75).toFixed(18)))
                                )}
                            >
                                75%
                            </button>
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setUnstakeAmount(
                                    formatEther(parseEther(userAmountStaked.toFixed(18)))
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
                            value={unstakeAmountInput}
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
                            My Staked Amount: {FormatNumber(userAmountStaked)}  <a target="_blank" href={`${EXPLORER_URL}/token/${APP_LP_TOKEN}`} className="underline">$CMLT-LP</a>
                        </div>
                    </div>
                    <div className="h-[2px] bg-[#FFE49A] w-full" />
                    <div className="bg-[#BF8D00] rounded-3xl py-6 px-7 flex flex-col gap-4">
                        {
                            !withdrawable && <div className="flex items-center justify-between">
                                <div className="text-sm text-[#FFFFE5] flex gap-2 items-center relative">
                                    <span>Early Unstake Fee:</span>
                                    <Tooltip
                                        arrow={false}
                                        placement="topLeft"
                                        title={
                                            <div className="flex p-2 flex-col gap-3 text-brown rounded-lg border-[1px] border-brown bg-[#FFEFC3] w-auto md:w-[320px]">
                                                <label className="text-sm font-bold">Early Unstake Fee: {penaltyFee}%</label>
                                                <div className="text-xs font-normal">
                                                    The fee you will be charged if you unstake before block <strong>{FormatNumber(penaltyBlock + latestDepositBlock)}</strong> (approximately 7 days from your last stake).
                                                </div>
                                            </div>
                                        }
                                    >
                                        <img src="/icons/icn-info-light.svg" className="w-[16px] h-[16px]" />
                                    </Tooltip>
                                </div>
                                <span className="text-lg font-bold text-[#FFFFE5]">
                                    {penaltyFeeAmount > 0 ? `${FormatNumber(penaltyFeeAmount)} $CMLT-LP` : `${penaltyFee}%`}
                                </span>
                            </div>
                        }
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-[#FFFFE5]">Unstake Fee Free After (Block):</label>
                            <span className="text-lg text-[#FFFFE5]">{FormatNumber(latestDepositBlock + penaltyBlock)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-[#FFFFE5]">Reward:</label>
                            <span className="text-lg font-bold text-[#FFFFE5]">{FormatNumber(pendingReward)} $SOBY</span>
                        </div>
                        <div className="h-[1px] bg-[#FFE49A] w-full" />
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-[#FFFFE5] flex gap-2 items-center">
                                <span>Actual Receive:</span>
                                <Tooltip
                                    arrow={false}
                                    placement="topLeft"
                                    title={
                                        <div className="flex p-2 flex-col gap-3 text-brown rounded-lg border-[1px] border-brown bg-[#FFEFC3] w-auto md:w-[320px]">
                                            <label className="text-sm font-bold">Actual Receive:</label>
                                            <div className="text-xs font-normal">The amount you will receive after unstaking, including the unstake amount and the rewards earned during your staking period.</div>
                                        </div>
                                    }
                                >
                                    <img src="/icons/icn-info-light.svg" className="w-[16px] h-[16px]" />
                                </Tooltip>
                            </div>
                            <div className="text-lg font-bold text-[#FFFFE5] flex gap-2">
                                <span>{FormatNumber(withdrawAmountAfterFee)} $CMLT-LP</span>
                                <span>+</span>
                                <span>{FormatNumber(pendingReward)} $SOBY</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <label className="checkbox">
                        <input type="checkbox" checked={isConfirmUnstake} onChange={(e) => setIsConfirmUnstake(e.target.checked)} />
                        <span className="checked"></span>
                    </label>
                    <label className="cursor-pointer" onClick={(e) => setIsConfirmUnstake(!isConfirmUnstake)}>By checking this box, I agree and understand all the information SOBY provided.</label>
                </div>

                <div className="w-full">
                    <button
                        disabled={unstakeAmount <= 0 || !isConfirmUnstake || isSubmitWithdraw || !!error}
                        onClick={() => isConfirmUnstake && unstakeAmount > 0 && !isSubmitWithdraw && onUnStaking()}
                        className={cn("w-full disabled:opacity-50 border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 h-10 leading-10 flex items-center justify-center gap-2")}
                    >
                        {isSubmitWithdraw ? 'Unstaking' : 'Unstake'}
                        {isSubmitWithdraw && <img src="/icons/icn-spinner.svg" className="animate-spin w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}