import { XAI_DECIMAIL } from "@/utils/chain.custom";
import cn from "@/utils/cn";
import {
  fibonacciNumbersSum,
  enoughBalance,
  enoughGasPrice,
  formatNumber,
} from "@/utils/helpers";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import {
  formatUnits,
  parseUnits,
  keccak256,
  isAddressEqual,
  maxUint256,
} from "viem";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from "wagmi";
import { mysteryBoxContract } from "@/contracts";
import { toast } from "react-toastify";
import IcnSpinner from "@/public/icons/icn-spinner.svg";
import Decimal from "decimal.js";
import { WHITELIST_ADDRESSES, merkleTree } from "@/contracts/data/whitelisted";
import { APP_MYSTERY_BOX_SMC, APP_XAI_TOKEN_ADDRESS } from "@/types/common";
import { getNftIdFromLogs } from "@/utils/helpers";
import ButtonConnect from "@/components/ButtonConnect";
import { ROUTER_CHAIN } from "@/types/common";
import { isNumber } from "lodash";

const MINT_START_TIME = 1709881200000;
const END_MINT_TIME = 1709881200000;
const CHAIN_ID = ROUTER_CHAIN['/'] ? ROUTER_CHAIN["/"].id : ROUTER_CHAIN['default'].id;

const Congras = ({
  nftImages,
  onClose,
}: {
  nftImages: string[];
  onClose: () => void;
}) => {
  const width = useMemo(() => {
    if (nftImages.length > 1) return 300;
    return 500;
  }, [nftImages.length]);

  return (
    <div className="fixed w-full h-full top-0 left-0 bg-[#000]/90 z-[9999] flex items-center justify-center flex-col gap-4">
      <div className="flex gap-3 justify-center flex-wrap max-w-[600px] lg:max-w-[900px] xl:max-w-[1000px] mx-auto max-h-[80%] overflow-y-auto">
        {nftImages.map((z, i) => (
          <Image
            key={i}
            src={z}
            alt="Soby Pirate Yacht Club"
            width={width}
            height={width}
            className="max-w-full rounded-2xl"
            style={{
              width: `${width}px`,
            }}
          />
        ))}
      </div>
      <button
        className={cn(
          `relative mt-4 border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 px-6 min-w-[200px]`
        )}
        onClick={onClose}
      >
        Minted successfully!
      </button>
    </div>
  );
};

const Coutdown = () => {
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [completed, setCompleted] = useState(true);

  const numberToString = (val: number) => {
    return val < 0 ? "00" : val < 10 ? `0${val}` : `${val}`;
  };

  const countdown = useCallback(() => {
    const now = Date.now();
    const date = END_MINT_TIME;
    const distance = isNumber(date) ? date - now : 0;
    setCompleted(distance <= 0);
    setDays(numberToString(Math.floor(distance / (1000 * 60 * 60 * 24))));
    setHours(
      numberToString(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      )
    );
    setMinutes(
      numberToString(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
    );
    setSeconds(numberToString(Math.floor((distance % (1000 * 60)) / 1000)));
  }, []);

  useEffect(() => {
    countdown();
    const interval = setInterval(() => {
      countdown();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [countdown]);
  const Value = ({ value, label }: { value: string; label: string }) => {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="w-[60px] h-[60px] border-[1px] border-light-brown rounded-xl bg-light-orange-200/30 leading-[40px] text-center text-[24px] font-bold flex items-center justify-center">
          {value}
        </div>
        <label className="text-sm font-normal">{label}</label>
      </div>
    );
  };

  if (completed) return null;
  return (
    <>
      <p className="text-[20px] leading-[32px] text-[#694D00]">Ended at:</p>
      <div className="flex gap-6">
        <Value label="Days" value={days} />
        <Value label="Hours" value={hours} />
        <Value label="Minutes" value={minutes} />
        <Value label="Seconds" value={seconds} />
      </div>
    </>
  );
};

const Mint = () => {
  const [amount, setAmount] = useState<number>(1);
  const [isMintLoading, setIsMintLoading] = useState<boolean>(false);
  const [isFreemintLoading, setIsFreemintLoading] = useState<boolean>(false);
  const [isFreemintSucceeded, setIsFreemintSucceeded] =
    useState<boolean>(false);
  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const [nftImages, setNftImages] = useState<string[]>([]);

  // const { data: balance } = useBalance({
  //   address,
  //   watch: true,
  //   chainId: ROUTER_CHAIN["/"].id,
  // });
  // const [isEndedMint, setIsEndedMint] = useState<boolean>(true);

  // const { data: xaiBalance } = useBalance({
  //   address,
  //   token: APP_XAI_TOKEN_ADDRESS as `0x${string}`,
  //   watch: true,
  //   chainId: ROUTER_CHAIN["/"].id,
  // });

  // const publicClient = usePublicClient();

  // const {
  //   data: mysteryBoxData,
  //   isError: isMysteryBoxError,
  //   isLoading: isMysteryBoxLoading,
  // } = useContractReads({
  //   contracts: [
  //     {
  //       ...mysteryBoxContract,
  //       functionName: "price",
  //       chainId: ROUTER_CHAIN["/"].id,
  //     },
  //     {
  //       ...mysteryBoxContract,
  //       functionName: "buyInWhitelist",
  //       args: [address],
  //       chainId: ROUTER_CHAIN["/"].id,
  //     },
  //     {
  //       ...mysteryBoxContract,
  //       functionName: "claimedFreemintCount",
  //       chainId: ROUTER_CHAIN["/"].id,
  //     },
  //     {
  //       ...mysteryBoxContract,
  //       functionName: "claimedFreemintSupply",
  //       chainId: ROUTER_CHAIN["/"].id,
  //     },
  //   ],
  // });

  // const {
  //   data: allowanceData,
  //   isError: isAllowanceError,
  //   isLoading: isAllowanceLoading,
  //   refetch: refetchAllowance,
  // } = useContractRead({
  //   address: APP_XAI_TOKEN_ADDRESS as `0x${string}`,
  //   abi: erc20ABI,
  //   args: [address as any, APP_MYSTERY_BOX_SMC as any],
  //   functionName: "allowance",
  //   chainId: ROUTER_CHAIN["/"].id,
  // });

  // const claimedFreemintCount = useMemo(() => {
  //   if (!mysteryBoxData) return 0;
  //   return Number(mysteryBoxData[2].result);
  // }, [mysteryBoxData]);

  // const claimedFreemintSupply = useMemo(() => {
  //   if (!mysteryBoxData) return 0;
  //   return Number(mysteryBoxData[3].result);
  // }, [mysteryBoxData]);

  // const price = useMemo(() => {
  //   try {
  //     if (!mysteryBoxData) return 1;
  //     return Number(formatUnits(mysteryBoxData[0].result as any, XAI_DECIMAIL));
  //   } catch (e) {
  //     return 1;
  //   }
  // }, [mysteryBoxData]);

  // const mintFee = useMemo(() => {
  //   const _price = new Decimal(price);
  //   return Number(_price.times(amount).toString());
  // }, [amount, price]);

  // const isAllowance = useMemo(() => {
  //   if (!allowanceData) return false;
  //   const _allowance = new Decimal(allowanceData.toString());
  //   return _allowance.greaterThanOrEqualTo(
  //     parseUnits(mintFee.toString(), XAI_DECIMAIL).toString()
  //   );
  // }, [allowanceData, mintFee]);

  // const isBuyInWhitelist = useMemo(() => {
  //   if (!mysteryBoxData) return false;
  //   if (!mysteryBoxData[1]) return false;
  //   return !!mysteryBoxData[1].result;
  // }, [mysteryBoxData]);

  // const freemintEnable = useMemo(() => {
  //   if (!address) return false;
  //   return WHITELIST_ADDRESSES.some((z) =>
  //     isAddressEqual(z.address as any, address as any)
  //   );
  // }, [address]);

  // // approve
  // const { data: approveData, writeAsync: approveAsync } = useContractWrite({
  //   address: APP_XAI_TOKEN_ADDRESS as `0x${string}`,
  //   abi: erc20ABI,
  //   functionName: "approve",
  //   chainId: ROUTER_CHAIN["/"].id,
  // });
  // const { isLoading: isWaitForApproveTransactionLoading } =
  //   useWaitForTransaction({
  //     confirmations: 1,
  //     hash: approveData?.hash,
  //     onSuccess: async (data) => {
  //       refetchAllowance();
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //     },
  //   });

  // // mint
  // const { data: mintData, writeAsync: mintAsync } = useContractWrite({
  //   ...mysteryBoxContract,
  //   functionName: "openBoxes",
  //   chainId: ROUTER_CHAIN["/"].id,
  // });
  // const { isLoading: isWaitForMintTransactionLoading } = useWaitForTransaction({
  //   confirmations: 1,
  //   hash: mintData?.hash,
  //   onSuccess: async (data) => {
  //     console.log(getNftIdFromLogs(data.logs));
  //     setNftImages(
  //       getNftIdFromLogs(data.logs).map(
  //         (z) => `https://assets.soby.lol/image/${Number(z)}.png`
  //       )
  //     );
  //     refetchAllowance();
  //     setIsMintLoading(false);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  // });

  // // freemint
  // const { data: freemintData, writeAsync: freemintAsync } = useContractWrite({
  //   ...mysteryBoxContract,
  //   functionName: "openBox",
  //   chainId: ROUTER_CHAIN["/"].id,
  // });
  // const { isLoading: isWaitForFreemintTransactionLoading } =
  //   useWaitForTransaction({
  //     confirmations: 1,
  //     hash: freemintData?.hash,
  //     onSuccess: async (data) => {
  //       setNftImages(
  //         getNftIdFromLogs(data.logs).map(
  //           (z) => `https://assets.soby.lol/image/${Number(z)}.png`
  //         )
  //       );
  //       refetchAllowance();
  //       setIsMintLoading(false);
  //       setIsFreemintSucceeded(true);
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //     },
  //   });

  // const decrease = () => {
  //   if (isMintLoading || isWaitForMintTransactionLoading || isEndedMint) return;
  //   if (amount <= 1) return;
  //   setAmount(amount - 1);
  // };

  // const increase = () => {
  //   if (isMintLoading || isWaitForMintTransactionLoading || isEndedMint) return;
  //   setAmount(amount + 1);
  // };

  // const approve = async () => {
  //   if (!isConnected)
  //     return toast("Please connect wallet to continue!", { type: "info" });
  //   setIsApproveLoading(true);
  //   try {
  //     const args = [APP_MYSTERY_BOX_SMC as `0x${string}`, maxUint256] as any;
  //     const estimateGas = await publicClient.estimateContractGas({
  //       address: APP_XAI_TOKEN_ADDRESS as `0x${string}`,
  //       abi: erc20ABI,
  //       args,
  //       functionName: "approve",
  //       account: address as any,
  //     });
  //     const _enoughGasPrice = enoughGasPrice(
  //       balance?.value as bigint,
  //       null,
  //       estimateGas
  //     );
  //     if (!_enoughGasPrice) return;
  //     await approveAsync?.({
  //       args,
  //     });
  //   } catch (e) {
  //     toast((e as any)?.shortMessage, { type: "error" });
  //     console.error(e);
  //   } finally {
  //     setIsApproveLoading(false);
  //   }
  // };

  // const mint = async () => {
  //   if (!isConnected)
  //     return toast("Please connect wallet to continue!", { type: "info" });
  //   if (amount <= 0) return toast.info("Please enter amount!");
  //   setIsMintLoading(true);
  //   try {
  //     const _mintFee = parseUnits(mintFee.toString(), XAI_DECIMAIL);
  //     const _enoughBalance = enoughBalance(
  //       xaiBalance?.value as bigint,
  //       _mintFee
  //     );
  //     if (!_enoughBalance) return;
  //     const estimateGas = await publicClient.estimateContractGas({
  //       ...mysteryBoxContract,
  //       args: [amount],
  //       functionName: "openBoxes",
  //       account: address as any,
  //     });
  //     const _enoughGasPrice = enoughGasPrice(
  //       balance?.value as bigint,
  //       null,
  //       estimateGas
  //     );
  //     if (!_enoughGasPrice) return;
  //     await mintAsync?.({
  //       args: [amount],
  //     });
  //   } catch (e) {
  //     toast((e as any)?.shortMessage, { type: "error" });
  //     console.error(e);
  //   } finally {
  //     setIsMintLoading(false);
  //   }
  // };

  // const freemint = async () => {
  //   if (!isConnected)
  //     return toast("Please connect wallet to continue!", { type: "info" });
  //   if (amount <= 0) return toast.info("Please enter amount!");
  //   setIsFreemintLoading(true);
  //   try {
  //     const leafNode = merkleTree.getHexProof(
  //       keccak256(address as `0x${string}`)
  //     );
  //     const estimateGas = await publicClient.estimateContractGas({
  //       ...mysteryBoxContract,
  //       args: [leafNode],
  //       functionName: "openBox",
  //       account: address as any,
  //     });
  //     const _enoughGasPrice = enoughGasPrice(
  //       balance?.value as bigint,
  //       0 as any,
  //       estimateGas
  //     );
  //     if (!_enoughGasPrice) return;
  //     await freemintAsync?.({
  //       args: [leafNode],
  //     });
  //   } catch (e) {
  //     toast((e as any)?.shortMessage, { type: "error" });
  //     console.error(e);
  //   } finally {
  //     setIsFreemintLoading(false);
  //   }
  // };

  // const countdown = useCallback(() => {
  //   const now = Date.now();
  //   const endAt = END_MINT_TIME;
  //   setIsEndedMint(now > endAt);
  // }, []);

  // useEffect(() => {
  //   countdown();
  //   const interval = setInterval(() => {
  //     countdown();
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [countdown]);

  return (
    <section
      id="mint-nft"
      className="border-y border-dashed border-[#694D00] py-[72px] mt-[50px] bg-[#FFF8E3]"
    >
      {nftImages.length > 0 ? (
        <Congras nftImages={nftImages} onClose={() => setNftImages([])} />
      ) : null}
      <div className="max-w-7xl px-5 xl:w-full xl:px-0 mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] lg:gap-0 gap-10">
        <Image
          src="/images/nft.gif"
          alt="nft"
          width={589}
          height={589}
          className="w-[500px] mx-auto lg:w-full lg:max-w-full border border-dashed rounded-3xl border-[#694D00]"
        />
        <div className="grid gap-6 content-start pl-0 lg:pl-10">
          <div className="flex justify-between items-start xl:items-center flex-col xl:flex-row gap-1">
            <div className="flex gap-3 items-center">
              <h3 className="text-[40px] leading-[70px] font-bold text-[#694D00]">
                Soby XAI
              </h3>
              <Image
                src="/images/footprint-brown.png"
                alt="footprint-brown"
                width={65}
                height={65}
              />
            </div>
            <div className="px-4 py-2 bg-[#FFCA38] rounded-lg text-[32px] leading-[40px] font-bold text-[#694D00]">
              Soby Pirate Yacht Club
            </div>
          </div>
          {/* <div className="p-4 bg-[#FFEFC3] rounded-[16px]">
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="mt-[10px]"
              >
                <circle
                  opacity="0.5"
                  cx="6.5"
                  cy="6.5"
                  r="6.5"
                  fill="#FFE49A"
                />
                <circle cx="6.5" cy="6.5" r="3.5" fill="#FFCA38" />
              </svg>
              <div className="flex-1">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <p className="text-[20px] leading-[32px] text-[#694D00] font-bold">
                      Eligible for free-mint?
                    </p>
                    <p className="text-[20px] leading-[32px] text-[#694D00]">
                      Grab your Pirate now
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#FFCA38] px-2 py-1">
                    <p className="text-[14px] leading-[24px] text-[#694D00] text-right">
                      Minted NFTs
                    </p>
                    <p className="text-[18px] leading-[24px] text-[#694D00] font-bold text-right">
                      {isMysteryBoxLoading
                        ? "--/--"
                        : `${formatNumber(
                          claimedFreemintCount +
                            (isFreemintSucceeded ? 1 : 0) >
                            claimedFreemintSupply
                            ? claimedFreemintSupply
                            : claimedFreemintCount +
                            (isFreemintSucceeded ? 1 : 0)
                        )}/${formatNumber(claimedFreemintSupply)}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-[10px] mt-4 flex-col lg:flex-row">
                  <p className="text-[20px] leading-[32px] text-[#694D00] italic">
                    All free mints have been claimed. Stay tuned for more
                    adventures ahead!
                  </p>
                </div>
              </div>
            </div>
          </div> */}
          <div className="bg-[#C79300] h-[1px]"></div>
          <div className="p-4 bg-[#FFEFC3] rounded-[16px]">
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="mt-[10px]"
              >
                <circle
                  opacity="0.5"
                  cx="6.5"
                  cy="6.5"
                  r="6.5"
                  fill="#FFE49A"
                />
                <circle cx="6.5" cy="6.5" r="3.5" fill="#FFCA38" />
              </svg>
              <div className="flex-1">
                <p className="text-[20px] leading-[32px] text-[#694D00] font-bold">
                  The Public NFT Minting has ended.
                </p>
                <p className="text-[20px] leading-[32px] text-[#694D00]">
                  Get more SPYC NFTs
                </p>
                <div className="flex justify-start mt-4">
                  <a
                    target="_blank"
                    className="border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 hover:py-[9px] px-6 gap-2"
                    href="https://opensea.io/collection/soby-pirate-yacht-club"
                  >
                    <img width="24px" src="/images/opensea.png" />
                    <span>Buy on OpenSea</span>
                  </a>
                </div>
                <div className="grid gap-2 mt-4">
                  <p className="text-[20px] leading-[32px] text-[#694D00]">
                    Owning <strong>#SPYC NFTs early unlocks</strong> gifts,
                    prizes from CoinFlip, and more on @XAI_GAMES!
                  </p>
                  <p className="text-[20px] leading-[32px] text-[#694D00]">
                    <strong>Special perk:</strong> A 3.5% fee from CoinFlip goes
                    directly to you, the holder!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mint;
