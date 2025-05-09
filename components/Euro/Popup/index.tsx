/* eslint-disable @next/next/no-img-element */

import { COINFLI_URL } from "@/types/common";
import cn from "@/utils/cn";
import { format, formatDistanceStrict } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export const EURO_DATETIME = [1718434800, 1721026800];

const EuroPopup = () => {
  const [isShow, setIsShow] = useState<boolean>(true);

  if (!isShow)
    return (
      <Link
        href={COINFLI_URL}
        target="_blank"
        className="fixed right-10 bottom-[60px] z-[999] flex flex-col items-center"
      >
        <div className="rounded-[8px] md:py-1 m:px-2 px-1 py-[2px] text-[12px] md:text-[16px] leading-normal text-[#FFFFE5] font-semibold bg-[#FFCA38] inline-flex">
          {formatDistanceStrict(
            new Date(EURO_DATETIME[1] * 1000),
            new Date()
          )}{" "}
          left
        </div>
        <img src="/images/euro-floating.png" alt="euro" className="w-[150px]" />
      </Link>
    );

  return (
    <div className="bg-[#000]/40 fixed top-0 left-0 z-[9999] flex justify-center items-center w-screen h-screen">
      <div className="relative flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="absolute top-[10%] right-5 sm:right-0 cursor-pointer"
          onClick={() => setIsShow(false)}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.40554 4.40554C4.94627 3.86482 5.82296 3.86482 6.36369 4.40554L16 14.0419L25.6363 4.40554C26.177 3.86482 27.0537 3.86482 27.5945 4.40554C28.1352 4.94627 28.1352 5.82296 27.5945 6.36369L17.9581 16L27.5945 25.6363C28.1352 26.177 28.1352 27.0537 27.5945 27.5945C27.0537 28.1352 26.177 28.1352 25.6363 27.5945L16 17.9581L6.36369 27.5945C5.82296 28.1352 4.94627 28.1352 4.40554 27.5945C3.86482 27.0537 3.86482 26.177 4.40554 25.6363L14.0419 16L4.40554 6.36369C3.86482 5.82296 3.86482 4.94627 4.40554 4.40554Z"
            fill="#FFFFE5"
          />
        </svg>
        <img
          src="/images/euro-popup.png"
          alt="soby euro"
          className="w-[800px]"
        />
      </div>
    </div>
  );
};

export default EuroPopup;
