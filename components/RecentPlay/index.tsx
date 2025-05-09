import { truncateAddress } from "@/utils/helpers";
import Image from "next/image";
import { formatEther, parseEther } from "viem";
import { formatDistanceStrict } from "date-fns";
import { useEffect, useState } from "react";
import { APP_API_URL } from "@/types/common";
import cn from "@/utils/cn";

const Loading = () => {
  return (
    <div className="bg-[#FFEFC3] p-2 flex gap-4 items-center border-b border-[#FFE49A]">
      <Image src="/images/logo.png" alt="soby" width={30} height={30} />
      <div className="flex-1">
        <div className="h-[21px] w-full rounded-lg soby-skeleton"></div>
        <div className="flex justify-end">
          <div className="h-[16.5px] w-[70px] rounded-lg soby-skeleton"></div>
        </div>

        {/* <p className="text-right text-sm">4 seconds</p> */}
      </div>
    </div>
  );
};

const RecentPlay = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [latestFlips, setLatestFlips] = useState<any[]>([]);

  const loadData = async (isFirst: boolean) => {
    setIsLoading(isFirst);
    try {
      const response = await fetch(`${APP_API_URL}/coinflip/flips`, {
        method: "GET",
      });
      const data = await response.json();
      setLatestFlips(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => {
      loadData(false);
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="max-w-full relative">
      {/* <Image
        src="/images/coin-flip.png"
        alt="soby coinflip"
        width={50}
        height={50}
        className="animate-flip absolute -left-[100px] top-10"
      />
      <Image
        src="/images/coin-flip.png"
        alt="soby coinflip"
        width={50}
        height={50}
        className="animate-flip absolute -right-[50px] top-1/2"
      /> */}
      <div className="rounded-lg border-[3px] border-[#FFCA38]">
        {isLoading ? (
          <>
            {Array(5)
              .fill(0)
              .map((z, i) => (
                <Loading key={i} />
              ))}
          </>
        ) : (
          latestFlips.slice(0, 5).map((z, i) => (
            <div
              key={i}
              className={cn(
                `bg-[#FFEFC3] p-2 flex gap-4 items-center border-b border-[#FFE49A]`,
                {
                  "rounded-t-lg": i === 0,
                  "rounded-b-lg": i === 6,
                }
              )}
            >
              <Image src="/images/logo.png" alt="soby" width={30} height={30} />
              <div className="flex-1 text-[#694D00]">
                <p>
                  {truncateAddress(z.user_address)} flipped for{" "}
                  <strong>{formatEther(z.bet_amount as any)}</strong> and{" "}
                  <strong>
                    {z.result === 0 ? (
                      <span className="text-[#00CD2F]">Won</span>
                    ) : (
                      <span className="text-[#f33]">Lost</span>
                    )}{" "}
                  </strong>
                  the flip.
                </p>
                <p className="text-right text-sm">
                  {formatDistanceStrict(
                    new Date(z.created_at * 1000),
                    new Date()
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentPlay;
