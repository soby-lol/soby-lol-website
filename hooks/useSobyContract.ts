import { sobySMC } from "@/contracts";
import { useAppContext } from "@/providers/Context";
import {
  APP_SWAP_ROUTER,
  APP_SOBY_ADDRESS,
  APP_BURN_ADDRESS,
  DECIMAL,
  APP_NETWORK,
} from "@/types/common";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { formatUnits } from "viem";
import {
  Address,
  useAccount,
  useBalance,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { getContract } from "wagmi/actions";

const TOTAL_SUPPLY = 210000000000000000;

export function useSobySMC() {
  const {chainSupported} = useAppContext();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  let sobyContract = useMemo(() => {
    return getContract(
      walletClient ? { ...sobySMC, walletClient, chainId: chainSupported.id } : { ...sobySMC, chainId: chainSupported.id }
    );
  }, [walletClient, chainSupported]);

  const { data: sobyData } = useBalance({
    chainId: chainSupported.id,
    address: address ?? "0x0000000000000000000000000000000000000000",
    token: APP_SOBY_ADDRESS as any,
    watch: true,
  });

  const sobyBalance = useMemo(() => {
    if (!sobyData) return BigInt(0);
    return sobyData.value;
  }, [sobyData]);

  const { data: burnData } = useBalance({
    chainId: chainSupported.id,
    address:
      (APP_BURN_ADDRESS as `0x${string}`) ??
      "0x0000000000000000000000000000000000000000",
    token: APP_SOBY_ADDRESS as any,
    watch: true,
  });

  const sobyBurnAmount = useMemo(() => {
    if (!burnData) return BigInt(0);
    return burnData.value;
  }, [burnData]);

  const sobyBurnPercent = useMemo(() => {
    const amount = formatUnits(sobyBurnAmount, DECIMAL);
    return Number((parseFloat(amount) / TOTAL_SUPPLY).toFixed(3)) * 100;
  }, [sobyBurnAmount]);

  const approve = async () => {
    try {
      const transaction = await sobyContract.write.approve([
        APP_SWAP_ROUTER as Address,
        sobyBalance,
      ]);
      if (transaction && publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: transaction,
        });

        if (receipt && receipt?.status === "success") {
          return true;
        }
      }
    } catch (e: any) {
      toast.error(e.message, { autoClose: 3000 });
    }

    return false;
  };

  return { approve, sobyBurnAmount, sobyBurnPercent };
}
