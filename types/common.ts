import { arbitrum, arbitrumSepolia, bscTestnet } from "viem/chains";
import { XaiGoerli, xaiMainnet } from "@/utils/chain.custom";

export const APP_NETWORK = process.env.NEXT_PUBLIC_NETWORK as
  | "testnet"
  | "mainnet";
export const DECIMAL = 6;
export const BLOCK_TIMES: any = {
  [arbitrum.id]: 0.3,
  [arbitrumSepolia.id]: 0.25,
  [bscTestnet.id]: 3,
  [XaiGoerli.id]: 1.5,
  [xaiMainnet.id]: 1.8,
};

export const BLOCK_TIMES_DEFAULT =
  APP_NETWORK === "testnet"
    ? BLOCK_TIMES[bscTestnet.id]
    : BLOCK_TIMES[xaiMainnet.id];

export const APP_MINT_SOBY_NFT_ENABLE =
  process.env.NEXT_PUBLIC_MINT_SOBY_NFT_ENABLE === "true";

export const ROUTER_CHAIN: any = {
  default:
    APP_NETWORK === "testnet"
      ? { id: bscTestnet.id, name: "Binance Smart Chain Testnet" }
      : { id: xaiMainnet.id, name: "Xai Orbit Mainnet" },
};

export const APP_API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const APP_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
export const APP_WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID || "";
export const APP_SOBY_ADDRESS = process.env.NEXT_PUBLIC_SOBY_ADDRESS || "";
export const APP_WHITELIST_ENABLE = process.env.NEXT_PUBLIC_WHITELIST_ENABLE === "true";
export const APP_FORM_AIRDROP_CLAIM_ENABLE = process.env.NEXT_PUBLIC_FORM_AIRDROP_CLAIM_ENABLE === "true";
export const APP_TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI || "";
export const APP_TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || "";
export const APP_TWITTER_CHALLENGE_CODE = process.env.NEXT_PUBLIC_TWITTER_CHALLENGE_CODE || "";
export const APP_DISTRIBUTION_AIRDROP_SMC = process.env.NEXT_PUBLIC_DISTRIBUTION_AIRDROP_SMC || "";
export const APP_TASKON_AIRDROP_SMC = process.env.NEXT_PUBLIC_TASKON_AIRDROP_SMC || "";
export const APP_JACKPOT_SMC = process.env.NEXT_PUBLIC_JACKPOT_SMC || "";
export const APP_MYSTERY_BOX_SMC = process.env.NEXT_PUBLIC_MYSTERY_BOX_SMC || "";
export const APP_STAKING_SMC = process.env.NEXT_PUBLIC_STAKING_SMC || "";
export const APP_LP_STAKING_SMC = process.env.NEXT_PUBLIC_LP_STAKING_SMC || "";
export const APP_LP_TOKEN = process.env.NEXT_PUBLIC_LP_TOKEN || "";
export const APP_JACKPOT_TIME_DURATION = process.env.NEXT_PUBLIC_JACKPOT_TIME_DURATION || 1800;
export const SOCIAL_URL = {
  TWITTER: {
    name: "Twitter",
    url: "",
    icon: "/icons/btn-twitter.svg",
  },
  TELEGRAM: {
    name: "Telegram",
    url: "",
    icon: "/icons/btn-telegram.svg",
  },
};

export const APP_XAI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_XAI_TOKEN_ADDRESS || "";

export const MYSTERY_BOX_EVENT_SIGNATURE = "";
export const SOBY_GRAPHQL = process.env.NEXT_PUBLIC_SOBY_GRAPHQL || "";
export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "";
export const STAKING_CREATED_BLOCK = process.env.NEXT_PUBLIC_STAKING_CREATED_BLOCK || 0;
export const STAKING_CREATED_TIMESTAMP = process.env.NEXT_PUBLIC_STAKING_CREATED_TIMESTAMP || 0;
export const APP_SWAP_ROUTER = process.env.NEXT_PUBLIC_SWAP_ROUTER || "";
export const APP_WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS || "";
export const APP_USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || "";
export const COINFLI_URL =
  APP_NETWORK === "testnet"
    ? ""
    : "";
export const JACKPOT_URL = process.env.NEXT_PUBLIC_SOBY_JACKPOT_URL || "";
export const SWAP_URL = process.env.NEXT_PUBLIC_SOBY_SWAP_URL || "";
export const APP_BURN_ADDRESS = process.env.NEXT_PUBLIC_APP_BURN_ADDRESS || "";
export const COIN_FLIP_ADDRESS = process.env.NEXT_PUBLIC_COIN_FLIP_ADDRESS || "";
export const COIN_FLIP_ADDRESS_ARB = process.env.NEXT_PUBLIC_COIN_FLIP_ADDRESS_ARB || "";
export const COIN_FLIP_ADDRESS_SOBY = process.env.NEXT_PUBLIC_COIN_FLIP_ADDRESS_SOBY || "";
export const CAMELOT_EXCHANGE_URL = ``;
export const DEFINED_GRAPH_URL = '';
export const DEFINED_API_KEY = '';
export const SCF_CHALLENGE_ENABLE = false;
export const LP_STAKING_DEFAULT_POOL_ID = 0;