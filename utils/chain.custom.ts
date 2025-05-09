import { defineChain } from "viem";

export const XAI_DECIMAIL = 18;

export const xaiSepolia = defineChain({
  id: 37714555429,
  name: "XAI Sepolia",
  network: "xai-sepolia",
  nativeCurrency: {
    name: "Arbitrum Sepolia Ether",
    symbol: "SepoliaETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-v2.xai-chain.net/rpc"],
    },
    public: {
      http: ["https://testnet-v2.xai-chain.net/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Arbiscan",
      url: "https://testnet-explorer-v2.xai-chain.net/",
    },
  },
  testnet: true,
});

export const XaiGoerli = defineChain({
  id: 47279324479,
  name: "Xai Görli Orbit",
  network: "xai-goerli",
  nativeCurrency: {
    name: "Xai Görli Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.xai-chain.net/rpc"],
    },
    public: {
      http: ["https://testnet.xai-chain.net/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Xai Görli Testnet Explorer",
      url: "https://testnet-explorer.xai-chain.net",
    },
  },
  testnet: true,
});

export const xaiMainnet = defineChain({
  id: 660279,
  name: "Xai",
  network: "Xai",
  nativeCurrency: {
    name: "XAI",
    symbol: "XAI",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://xai-chain.net/rpc"],
    },
    public: {
      http: ["https://xai-chain.net/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Xai Explorer",
      url: "https://explorer.xai-chain.net/",
    },
  },
});
