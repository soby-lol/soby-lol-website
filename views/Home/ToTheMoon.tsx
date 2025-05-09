import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RecentPlay from "@/components/RecentPlay";
import { APP_NETWORK, COINFLI_URL, SCF_CHALLENGE_ENABLE } from "@/types/common";
import { useSobySMC } from "@/hooks/useSobyContract";
import { usePathname } from "next/navigation";

const Animate = () => {
  let containerEl: any = null;
  const confettiFrequency = 3;
  const confettiColors = [
    "#EF2964",
    "#00C09D",
    "#2D87B0",
    "#48485E",
    "#EFFF1D",
  ];
  const confettiAnimations = ["slow", "medium", "fast"];

  const setupElements = () => {
    const el = document.querySelector(".soby-congras") as any;
    const _containerEl = document.createElement("div");
    const elPosition = el.style.position;

    if (elPosition !== "relative" || elPosition !== "absolute") {
      el.style.position = "relative";
    }

    _containerEl.classList.add("confetti-container");

    el.appendChild(_containerEl);

    containerEl = _containerEl;
  };

  const renderConfetti = () => {
    const el = document.querySelector(".soby-congras") as any;
    const confettiInterval = setInterval(() => {
      const confettiEl = document.createElement("div") as any;
      const confettiSize = Math.floor(Math.random() * 3) + 7 + "px";
      const confettiBackground =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const confettiLeft = Math.floor(Math.random() * el.offsetWidth) + "px";
      const confettiAnimation =
        confettiAnimations[
          Math.floor(Math.random() * confettiAnimations.length)
        ];

      confettiEl.classList.add(
        "confetti",
        "confetti--animation-" + confettiAnimation
      );
      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;

      confettiEl.removeTimeout = setTimeout(function () {
        confettiEl.parentNode.removeChild(confettiEl);
      }, 2000);

      containerEl.appendChild(confettiEl);
    }, 25);
  };

  useEffect(() => {
    setupElements();
    renderConfetti();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="soby-congras h-full"></div>
    </div>
  );
};

export default function ToTheMoon() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgHeight, setImgHeight] = useState(600);
  const path = usePathname();

  const { approve } = useSobySMC();

  useEffect(() => {
    setImgHeight(imgRef.current?.height || 600);
  }, [imgRef, imgHeight]);

  return (
    <div
      className={cn(`relative flex flex-col justify-end px-5`)}
    >
      {/* <div className="w-full relative py-[70px] z-10 overflow-hidden">
        <div className="max-w-7xl px-5 w-full xl:px-0 mx-auto flex justify-between lg:flex-row flex-col gap-10 items-center">
          <div className="flex flex-col gap-6 max-w-[571px]">
            <div className="text-[60px] font-normal">
              <span className="text-[#C79300]">$SOBY.</span> The XAI Founder Dog
            </div>
            <div className="text-[32px] font-normal max-w-[600px] leading-10">
              $SOBY is the meme inspired by a 'good boy' dog owned by @sobylife,
              one of the co-founders of the @XAI_Games blockchain.
            </div>
           
          </div>
          <div className="grid gap-10 flex-1">
            {SCF_CHALLENGE_ENABLE ? (
              <div className="px-4 py-6 rounded-[24px] border-b-2 border-[#694D00] bg-[#FFEFC3] gap-[13px] relative">
                <div className="flex gap-[10px] items-center">
                  <h3 className="text-[24px] leading-[32px] font-bold text-[#694D00]">
                    <span className="text-[#C79300]">SOBY</span> CoinFlip (SCF)
                    Challenge #1
                  </h3>
                  <div className="rounded-[8px] bg-[#C79300] px-6 py-1 text-[#FFFFE5] text-base">
                    Ended
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row mt-6 gap-4 items-start">
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <Image
                          src="/images/soby-coin-front.png"
                          alt="soby"
                          width={140}
                          height={140}
                          className="mx-auto"
                        />
                      </div>
                      <div className="flip-card-back">
                        <Image
                          src="/images/soby-coin-back.png"
                          alt="soby"
                          width={140}
                          height={140}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 flex-1 relative">
                    <p className="text-[16px] leading-[24px] text-[#694D00] font-bold">
                      Luck or Skill - All on the Double or Nothing
                    </p>
                    <p className="text-[16px] leading-[24px] text-[#694D00]">
                      Competing for the{" "}
                      <span className="font-bold text-[#C79300]">
                        TOP VOLUME
                      </span>{" "}
                      and{" "}
                      <span className="font-bold text-[#C79300]">
                        TOP NET GAINS
                      </span>{" "}
                      for playing by <span className="font-bold">$XAI</span> and{" "}
                      <span>$SOBY</span>
                    </p>
                    <p className="text-[24px] leading-[32px] text-[#694D00]">
                      Total prize pool:{" "}
                      <span className="font-bold text-[#C79300]">
                        Up to $1,000
                      </span>
                    </p>
                    <div className="flex justify-start">
                      <a
                        target="_blank"
                        className="border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 hover:py-[9px] px-6 gap-2"
                        href={COINFLI_URL}
                      >
                        Play CoinFlip Now!
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 rounded-[24px] border-b-2 border-[#694D00] flex bg-[#FFEFC3] gap-[13px] relative">
                <Animate />
                <div className="relative">
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <Image
                          src="/images/soby-coin-front.png"
                          alt="soby"
                          width={140}
                          height={140}
                          className="mx-auto"
                        />
                      </div>
                      <div className="flip-card-back">
                        <Image
                          src="/images/soby-coin-back.png"
                          alt="soby"
                          width={140}
                          height={140}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 flex-1 relative">
                  <h3 className="text-[24px] leading-[32px] font-bold text-[#694D00]">
                    <span className="text-[#C79300]">SOBY</span> CoinFlip
                  </h3>
                  <p className="text-[16px] leading-[24px] text-[#694D00]">
                    SOBY Coin Flip is an algorithm-based game that offers users
                    the chance to play "Double or Nothing" using their XAI or
                    SOBY tokens. The game is inspired by the popular Degen Coin
                    Flip from the Solana blockchain.
                  </p>
                  <div className="flex justify-start">
                    <a
                      target="_blank"
                      className="border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 hover:py-[9px] px-6 gap-2"
                      href={COINFLI_URL}
                    >
                      Play CoinFlip Now!
                    </a>
                  </div>
                </div>
              </div>
            )}

            <RecentPlay />
          </div>
        </div>
      </div> */}
      <div className="w-full relative py-[70px] z-10 overflow-hidden">
        <div className="max-w-7xl rounded-[24px] px-5 bg-[#FFEFC3] border-b-2 border-[#694D00] mx-auto pb-5 relative bg-bottom bg-contain bg-no-repeat" style={{
          backgroundImage: `url(/images/euro-bg.png)`
        }}>
          <img src="/images/euro-cup.png" alt="euro cup" className="hidden xl:block w-[230px] absolute bottom-0 left-[88px]" />
          <img
            src="/images/soby-euro.png"
            alt="soby euro"
            className="w-[115px] mx-auto"
          />
          <div className="max-w-[473px] mx-auto text-base text-[#694D00] text-center my-2">
            Dive into your thrill with{" "}
            <span className="text-[#C79300] font-bold">SOBY EURO 2024</span>.
            Collection of{" "}
            <span className="text-[#C79300] font-bold">24 unique NFTs</span>{" "}
            from each country. Be among the first to collect the entire Euro
            collection and unlock exclusive rewards!
          </div>
          <div className="text-center text-base text-[#694D00]">
            Period Challenge:{" "}
            <span className="font-bold text-[#C79300]">
              June 14th to July 15th
            </span>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <img
              src="/images/euro-gift.png"
              alt="euro gift"
              className="w-[226px]"
            />
            <a
              target="_blank"
              className="border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 hover:py-[9px] px-6 gap-2"
              href={COINFLI_URL}
            >
              Play Soby Euro Now!
            </a>
          </div>
        </div>
      </div>
      {/* <img
        ref={imgRef}
        src="/images/banner.png"
        className=" absolute top-0 left-0 z-0 w-full bg-[#ffffe6]"
      /> */}
    </div>
  );
}
