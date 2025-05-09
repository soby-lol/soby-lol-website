"use client";

import { auth } from "@/utils/firebase";
import { signInAnonymously } from "firebase/auth";
import { useEffect } from "react";
import SCFChallengePopup from "@/components/SCFChallenge/Popup";
import { SCF_CHALLENGE_ENABLE } from "@/types/common";
import EuroPopup from "@/components/Euro/Popup";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    signInAnonymously(auth);
  }, []);
  return (
    <>
      {SCF_CHALLENGE_ENABLE ? <SCFChallengePopup /> : null}
      {/* <EuroPopup /> */}

      {children}
    </>
  );
};

export default MainLayout;
