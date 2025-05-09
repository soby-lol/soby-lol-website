import { StakingContract } from "@/hooks/useStakingContract";
import { DECIMAL } from "@/types/common";
import cn from "@/utils/cn";
import { FormatNumber } from "@/utils/helpers";
import { Tooltip } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    tokenAddress: string;
    stakingSMC: StakingContract;
};

export default function StakingForm({ isOpen, onClose, tokenAddress, stakingSMC }: Props) {
    if (!isOpen) return null;

    const [amountStakingInput, setAmountStaking] = useState('0');
    const [projectedAmountReturn, setProjectedAmountReturn] = useState(0);
    const [apr, setAPR] = useState(0);
    const [error, setError] = useState('');
    const { limitAmount, totalStaked, calcAPR, isSubmitStaking, onDeposit, penaltyFee } = stakingSMC;

    const { address } = useAccount();
    const { data: sobyData } = useBalance({
        address: address ?? "0x0000000000000000000000000000000000000000",
        token: tokenAddress as any,
        watch: true,
    });

    const sobyBalance = useMemo(() => {
        if (!sobyData) return 0;
        return Number(formatUnits(sobyData.value as any, DECIMAL));
    }, [sobyData]);

    const amountCanStake = useMemo(() => {
        return sobyBalance > limitAmount ? limitAmount : sobyBalance;
    }, [sobyBalance, limitAmount]);

    const amountStaking = useMemo(() => {
        if (!amountStakingInput) return 0;
        const value = Number(amountStakingInput.replace(/,/g, ''));
        if (isNaN(value)) return 0;
        if (value > amountCanStake) return amountCanStake;

        if (value < 0) return 0;
        return value;

    }, [amountStakingInput, amountCanStake]);

    const onChangeAmountStaking = (e: any) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        const value = e.target.value;
        if (regex.test(value)) {
            setError("");
            setAmountStaking(value);
            const amount = Number(value.replace(/,/g, ''));
            if (isNaN(amount)) {
                setError("Amount invalid");
                return;
            }
            if (amount > sobyBalance) {
                setError("Not enough balance");
                return;
            }
            if (amount > amountCanStake) {
                setError(`The amount must be less than ${FormatNumber(amountCanStake)}`);
                return;
            }

            if (amount < 0) {
                setError(`The amount must be greater than > 0`);
                return;
            };
        }
    }

    const onStaking = useCallback(async () => {
        await onDeposit(amountStaking.toString());
        onClose();
    }, [amountStaking]);

    const calcProjectedAmount = async () => {
        if (amountStaking > 0) {
            const apr = await calcAPR(totalStaked + amountStaking);
            setProjectedAmountReturn(Number((amountStaking * apr) / 100));
            setAPR(apr);
        }
    }

    useEffect(() => {
        calcProjectedAmount();
    }, [amountStaking])

    return (
        <div className="fixed inset-0 bg-[#000] bg-opacity-30 flex justify-center items-center top-0 left-0 z-50">
            <div className="w-[90%] max-w-[650px] bg-[#FFFFE5] py-10 px-7 rounded-3xl shadow-xl transition-transform transform-gpu scale-110 animate-zoomOut flex flex-col gap-3 border-b-[2px] border-brown">
                <div onClick={() => onClose()} className='absolute top-10 right-7 w-[36px] h-[36px] flex justify-end items-center cursor-pointer'>
                    <img src="/icons/icn-close.svg" />
                </div>
                <div className="flex gap-4 items-center content-center">
                    <img src="/images/logo.png" className="w-[60px]" />
                    <div className="text-2xl font-bold">Staking $SOBY</div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between w-full items-center content-center">
                        <label className="text-sm">Stake Amount</label>
                        <div className="flex gap-[10px] w-max">
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setAmountStaking((amountCanStake * 0.25).toString())}
                            >
                                25%
                            </button>
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setAmountStaking((amountCanStake * 0.5).toString())}
                            >
                                50%
                            </button>

                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setAmountStaking((amountCanStake * 0.75).toString())}
                            >
                                75%
                            </button>
                            <button
                                className="h-10 leading-10 px-5 rounded-lg bg-[#FFEFC3]"
                                onClick={() => setAmountStaking(amountCanStake.toString())}
                            >
                                Max
                            </button>
                        </div>
                    </div>
                    <div className={cn("w-full p-4 bg-[#FFE49A] rounded-xl border-b-[2px] border-[#FFE49A] relative", {
                        "border-[#e82b2b]": !!error
                    })}>
                        <input type="text"
                            className={cn(`w-full border-none text-[28px] leading-10 font-bold bg-[#FFE49A] h-[40px] outline-none`)}
                            disabled={false}
                            onChange={onChangeAmountStaking}
                            value={amountStakingInput}
                        />
                    </div>
                    <div className="flex justify-between items-center -mt-2">
                        {
                            !!error ? <div className="text-[#e82b2b] text-sm font-bold">
                                * {error}
                            </div> : <div></div>
                        }
                        <div className="text-sm text-right">
                            Balance: {FormatNumber(sobyBalance)} $SOBY
                        </div>
                    </div>

                    <div className="h-[2px] bg-[#FFE49A] w-full" />
                    <div>
                        <label className="text-sm">Position Overview</label>
                        <div className="bg-[#BF8D00] rounded-3xl py-6 px-7 flex flex-col gap-4 mt-4">
                            <div className="flex justify-between">
                                <label className="text-sm text-[#FFFFE5]">Stake Amount:</label>
                                <span className="text-lg text-[#FFFFE5]">{FormatNumber(amountStaking)}</span>
                            </div>
                            <div className="flex justify-between">
                                <label className="text-sm text-[#FFFFE5]">APY:</label>
                                <span className="text-lg text-[#FFFFE5]">~{FormatNumber(apr)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <div className="text-sm text-[#FFFFE5] flex gap-2 items-center relative">
                                    <span>Early UnStake Fee:</span>
                                    <Tooltip
                                        arrow={false}
                                        placement="topLeft"
                                        title={
                                            <div className="flex p-2 flex-col gap-3 text-brown rounded-lg border-[1px] border-brown bg-[#FFEFC3] w-auto md:w-[320px]">
                                                <label className="text-sm font-bold">Early Unstake Fee: {penaltyFee}% of the unstake amount.</label>
                                                <div className="text-xs font-normal">
                                                    The fee you will be charged if you unstake before 5 days from the time you last staked.
                                                </div>
                                            </div>
                                        }
                                    >
                                        <img src="/icons/icn-info-light.svg" className="w-[16px] h-[16px]" />
                                    </Tooltip>
                                </div>
                                <span className="text-lg font-bold text-[#CB0000]">{penaltyFee}%</span>
                            </div>
                            <div className="flex justify-between">
                                <div className="text-sm text-[#FFFFE5] flex gap-2 items-center relative">
                                    <span>Estimate Reward:</span>
                                    <Tooltip
                                        arrow={false}
                                        placement="topLeft"
                                        title={
                                            <div className="flex p-2 flex-col gap-3 text-brown rounded-lg border-[1px] border-brown bg-[#FFEFC3] w-auto md:w-[320px]">
                                                <label className="text-sm font-bold">Estimate Reward:</label>
                                                <div className="text-xs font-normal">The estimate reward amount that earned during your staking period.</div>
                                            </div>
                                        }
                                    >
                                        <img src="/icons/icn-info-light.svg" className="w-[16px] h-[16px]" />
                                    </Tooltip>
                                </div>
                                <span className="text-lg text-[#FFFFE5]">{FormatNumber(projectedAmountReturn)} $SOBY</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <button
                        disabled={amountStaking <= 0 || isSubmitStaking || amountCanStake <= 0 || !!error}
                        onClick={() => amountStaking > 0 && !isSubmitStaking && onStaking()}
                        className={cn("w-full disabled:opacity-50 border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 h-10 leading-10 flex items-center justify-center gap-2", {

                        })}
                    >
                        <span>{isSubmitStaking ? 'Staking' : (amountCanStake > 0 ? 'Stake' : (sobyBalance > 0 ? 'Full' : 'Stake'))}</span>
                        {isSubmitStaking && <img src="/icons/icn-spinner.svg" className="animate-spin w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}