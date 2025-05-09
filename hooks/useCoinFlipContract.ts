import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { arbitrum } from "viem/chains";
import { xaiMainnet } from "@/utils/chain.custom";
import { coinFlipContract, coinFlipSobyContract } from "@/contracts";
export default function useCoinFlipContract() {
    const [totalFlips, setTotalFlips] = useState(0);
    const publicClientXai = usePublicClient({ chainId: xaiMainnet.id });

    const totalGameXai = useMemo(async () => {
      return (await publicClientXai.readContract({
        ...coinFlipContract,
        args: [],
        functionName: "totalGame",
      })) as any
    }, [publicClientXai]);

    const totalGameSoby = useMemo(async () => {
      return (await publicClientXai.readContract({
        ...coinFlipSobyContract,
        args: [],
        functionName: "totalGame",
      })) as any
    }, [publicClientXai]);

    const getTotalFlips = async () => {
        try {
          const totalGameArb = 147;
          setTotalFlips(
            Number(totalGameArb) + Number(await totalGameXai) + Number(await totalGameSoby)
          );
        } catch {}
    };

    useEffect(() => {
      getTotalFlips();
      const t = setInterval(() => {
          getTotalFlips();
      }, 10000);
      return () => {
        clearInterval(t);
      };
    }, []);

    return {totalFlips}
}