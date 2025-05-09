"use client";
import { BrowserView, MobileView } from 'react-device-detect';

/* eslint-disable @next/next/no-img-element */
const SupportScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BrowserView>
        {children}
      </BrowserView>
      <MobileView>
        <div className="w-full h-screen flex justify-center items-center sm:hidden flex-col z-[9999] fixed bg-[#FFFFE5] top-0">
          <img src="/images/logo.png" className="w-[100px] mx-auto mb-6" />
          <p className="text-brown px-4 text-center text-xl font-bold">
            UNSUPPORTED BROWSER
          </p>
          <p className="text-orange-100 px-4 text-center">
            {`Sorry, we don't support mobile browsers.`} <br />{" "}
            {`We recommend using a computer to access our website for the best viewing experience.`}
          </p>
        </div>
      </MobileView>
    </>
  );
};

export default SupportScreen;
