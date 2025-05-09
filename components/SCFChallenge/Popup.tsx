/* eslint-disable @next/next/no-img-element */

import { COINFLI_URL } from "@/types/common";
import cn from "@/utils/cn";
import { format, formatDistanceStrict } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export const SCF_CHALLENGE_DATETIME = [1716447600, 1717052400];

const SCFChallengePopup = () => {
  const [isShow, setIsShow] = useState<boolean>(true);

  return (
    <Link
      href={COINFLI_URL}
      target="_blank"
      className="fixed right-10 bottom-[60px] z-[999] flex flex-col items-center"
    >
      <img
        src="/images/scf-challenge.png"
        alt="scf challenge"
        className="w-[160px] md:w-[200px]"
      />
    </Link>
  );
};

export default SCFChallengePopup;
