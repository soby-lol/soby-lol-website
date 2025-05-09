
import { APP_DISTRIBUTION_AIRDROP_SMC, APP_JACKPOT_SMC, APP_SWAP_ROUTER, APP_MYSTERY_BOX_SMC, APP_SOBY_ADDRESS, APP_STAKING_SMC, APP_TASKON_AIRDROP_SMC, COIN_FLIP_ADDRESS, COIN_FLIP_ADDRESS_ARB, COIN_FLIP_ADDRESS_SOBY, APP_LP_STAKING_SMC, APP_LP_TOKEN } from "@/types/common";
import ARBAirdropABI from "./abi/ARBAirdropABI";
import LuckyDrawABI from "./abi/LuckyDrawABI";
import MysteryBoxABI from "./abi/MysteryBoxABI";
import TaskOnAirdrop from "./abi/TaskOnAirdrop";
import StakingABI from "./abi/StakingABI";
import { erc20ABI } from "wagmi";
import RouterSwapABI from "./abi/RouterSwapABI";
import COIN_FLIP_ABI from "./abi/CoinFlipABI";
import LPStakingABI from "./abi/LPStakingABI";

export const distributionAirdrop = {
  abi: ARBAirdropABI,
  address: APP_DISTRIBUTION_AIRDROP_SMC as any,
};

export const luckyDraw = {
  abi: LuckyDrawABI,
  address: APP_JACKPOT_SMC as any,
}

export const taskOnAirdrop = {
  abi: TaskOnAirdrop,
  address: APP_TASKON_AIRDROP_SMC as any,
}

export const mysteryBoxContract = {
  abi: MysteryBoxABI,
  address: APP_MYSTERY_BOX_SMC as any,
};

export const stakingSMC = {
  abi: StakingABI,
  address: APP_STAKING_SMC as any,
};

export const lpStakingSMC = {
  abi: LPStakingABI,
  address: APP_LP_STAKING_SMC as any,
};

export const lpTokenSMC = {
  abi: erc20ABI,
  address: APP_LP_TOKEN as any,
};

export const sobySMC = {
  abi: erc20ABI,
  address: APP_SOBY_ADDRESS as any,
};

export const routerSwapSMC = {
  abi: RouterSwapABI,
  address: APP_SWAP_ROUTER as any,
};

export const coinFlipContract = {
  abi: COIN_FLIP_ABI,
  address: COIN_FLIP_ADDRESS as any,
};

export const coinFlipArbContract = {
  abi: COIN_FLIP_ABI,
  address: COIN_FLIP_ADDRESS_ARB as any,
};

export const coinFlipSobyContract = {
  abi: COIN_FLIP_ABI,
  address: COIN_FLIP_ADDRESS_SOBY as any,
};