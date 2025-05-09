import { useDistributionSMC } from "@/hooks/useDistributionContract";
import cn from "@/utils/cn";
import { FormatNumber } from "@/utils/helpers";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import ButtonConnect from "../ButtonConnect";

export default function FormDistributionClaim() {
  const {
    totalClaimableAmount,
    totalClaimedAmount,
    claimableAmount,
    isChecking,
    isClaimed,
    isOnWhiteList,
    onClaim,
    claimLoading,
  } = useDistributionSMC();

  const { isConnected } = useAccount();

  const progress = useMemo(() => {
    const p = (totalClaimedAmount / totalClaimableAmount) * 100;
    return p > 100 ? 100 : p;
  }, [totalClaimedAmount, totalClaimableAmount]);

  const isEnableButton = useMemo(() => {
    return (
      !isClaimed && isOnWhiteList && !claimLoading && !isChecking && isConnected
    );
  }, [isChecking, isClaimed, isOnWhiteList, claimLoading, isConnected]);

  return (
    <div id="form-arb-claim" className="max-w-7xl xl:w-full mx-auto">
      <div className="w-full flex flex-col justify-center items-center content-center">
        <div className="text-[32px] font-bold">Ecosystem Airdrop</div>
        <div className="flex gap-6 flex-col">
          <div className="text-lg font-normal leading-7 text-center">
          Now you can expand your $SOBY holdings with our Ecosystem Airdrop.
          Eligible for those whose TaskOn-completed wallets meet one of the
          following conditions: received an $ARB Airdrop or an $XAI Airdrop,
          hold KaleidoCube NFT, or SPYC NFT. Especially, wallets that run XAI
          Sentry Node can claim directly, TaskOn is not required! Join the meme
          revolution and earn $SOBY tokens now!
          </div>
          <div
            className={cn(
              `mx-auto border-b-[2px] border-brown rounded-lg flex gap-2 items-center justify-between font-bold text-base bg-light-orange-200 text-brown py-1 px-4 w-auto`
            )}
          >
            <img src="/icons/icn-time.svg" />
            <span>
              2024.05.11 1:00 PM (UTC+0) - 2024.05.12 1:00 PM (UTC+0)
            </span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-6 mt-6">
          <div className="flex justify-between text-sm font-normal relative">
            <span>Received</span>
            <span>{FormatNumber(totalClaimableAmount)}</span>
          </div>
          <div className="">
            <div className="w-full relative">
              <div className="absolute bottom-0" style={{ left: `${progress}%`}}>{progress > 0 && progress.toFixed(2)}%</div>
            </div>
            <div
              className={cn(
                "w-full relative h-[10px] rounded-full bg-[#71633D] overflow-hidden"
              )}
            >
              <div
                style={{ width: progress + "%" }}
                className={cn(
                  "bg-[#FFCA38] h-[10px] rounded-full absolute top-0 left-0"
                )}
              ></div>
            </div>
          </div>
          <div className="w-full p-4 bg-[#FFE49A] rounded-xl">
            <input
              readOnly={true}
              type="text"
              className={cn(
                `w-full border-none text-[28px] leading-10 font-bold bg-[#FFE49A] h-[40px] outline-none`,
                {
                  "opacity-50": isClaimed || !isOnWhiteList,
                }
              )}
              // value={FormatNumber(claimableAmount)}
              value={0}
              //disabled={isClaimed}
              disabled={true}
            />
          </div>
        </div>
        {/*isOnWhiteList || (!isOnWhiteList && isChecking) ? (
          <button
            className={cn(
              `mt-8 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-[transparent] hover:bg-light-orange-100 py-2 px-6 w-[200px]`,
              {
                "opacity-50": !isEnableButton,
              }
            )}
            onClick={!isClaimed && isConnected ? () => onClaim() : () => {}}
          >
            {isClaimed && isConnected
              ? "Claimed"
              : claimLoading
              ? "Claiming"
              : "Claim Airdrop"}
          </button>
        ) : (
          <div className="text-[#c50b0b] mt-4">
            *You're not on the whitelist
          </div>
        )*/}
        <button className={cn(`mt-8 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-[transparent] hover:bg-light-orange-100 py-2 px-6 w-[200px] opacity-50`)}>
          Ended  
        </button>
      </div>
    </div>
  );
}
