"use client";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import {
  APP_NETWORK,
  APP_SITE_URL,
  APP_WALLET_CONNECT_PROJECT_ID,
} from "@/types/common";
import { WagmiConfig } from "wagmi";
import { XaiGoerli, xaiMainnet } from "@/utils/chain.custom";
import { useMemo } from "react";
import { arbitrum, bscTestnet, arbitrumSepolia } from "viem/chains";
import NonSSRWrapper from "@/components/NonSSRWrapper";

const projectId = APP_WALLET_CONNECT_PROJECT_ID;

export const networks = {
  testnet: [arbitrumSepolia, bscTestnet, XaiGoerli],
  mainnet: [arbitrum, xaiMainnet],
};

const metadata = {
  name: "Soby Meme",
  description: "Soby Meme",
  url: APP_SITE_URL,
  icons: [`${APP_SITE_URL}/images/logo.png`],
};

export function WalletConnect({ children }: { children: React.ReactNode }) {
  const chains = useMemo(() => [...networks[APP_NETWORK]], [APP_NETWORK]);
  const wagmiConfig = defaultWagmiConfig({
    projectId,
    chains: chains as any,
    metadata,
  });

  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains: chains as any,
  });
  return (
    <NonSSRWrapper>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </NonSSRWrapper>
  );
}
