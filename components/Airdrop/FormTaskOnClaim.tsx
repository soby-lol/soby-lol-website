import { useTaskOnSMC } from "@/hooks/useTaskonContract";
import cn from "@/utils/cn";
import { FormatNumber } from "@/utils/helpers";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export default function FormTaskOnClaim() {
  const { isConnected } = useAccount();
  const {
    claimableAmount,
    totalClaimableAmount,
    totalClaimedAmount,
    isClaimed,
    isPaused,
    isOnWhiteList,
    onClaim,
    claimLoading,
    error,
  } = useTaskOnSMC();

  const progress = useMemo(() => {
    const p = (totalClaimedAmount / totalClaimableAmount) * 100;
    return p > 100 ? 100 : p;
  }, [totalClaimedAmount, totalClaimableAmount]);

  const isEnableButton = useMemo(() => {
    return !isClaimed && !claimLoading && !isPaused && isConnected;
  }, [isClaimed, claimLoading, isPaused, isConnected]);

  return (
    <div id="form-taskon-claim" className="max-w-7xl xl:w-full mx-auto">
      <div className="w-full flex flex-col justify-center items-center content-center">
        <div className="text-[32px] font-bold">Growth Airdrop</div>
        <div className="flex gap-6 flex-col">
          <div className="text-lg font-normal leading-7 text-center">
            Welcome to the official $SOBY Airdrop claiming page! <br /> Your
            hard work has earned you a chance to claim your $SOBY airdrop, a
            meme token on the XAI_Games platform. Participating in this airdrop
            is your chance to be a part of the exciting meme revolution and
            potentially benefit from future value appreciation.
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
        <div className="w-full flex flex-col gap-6 mt-4">
          <div className="flex justify-between text-sm font-normal">
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
              <div className="w-full relative h-[10px] rounded-full bg-[#71633D] overflow-hidden">
                <div style={{ width: progress + "%" }} className="bg-[#FFCA38] h-[10px] rounded-full absolute top-0 left-0"></div>
              </div>
            </div>
          </div>
          <div className="w-full p-4 bg-[#FFE49A] rounded-xl">
            <input
              readOnly={true}
              type="text"
              className={cn(
                `w-full border-none text-[28px] leading-10 font-bold bg-[#FFE49A] h-[40px] outline-none`,
                {
                  "opacity-50": isClaimed || !isConnected,
                }
              )}
              // value={FormatNumber(claimableAmount)}
              // disabled={isClaimed}
              value={0}
              disabled={true}
            />
          </div>
        </div>
        {/*isOnWhiteList || (!isOnWhiteList && !isConnected) ? (
          !error ? (
            <button
              className={cn(
                `mt-8 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:bg-light-orange-100 hover:border-[transparent] py-2 px-6 w-[200px]`,
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
            <div className="text-[#c50b0b] mt-4">*{error}</div>
          )
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
