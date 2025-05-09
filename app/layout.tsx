import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "react-toastify/dist/ReactToastify.css";
import { AppContextProvider } from "@/providers/Context";
import { WalletConnect } from "@/providers/WalletConnect";
import { APP_SITE_URL } from "@/types/common";
import type { Metadata } from "next";
import { Overlock } from "next/font/google";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import MainLayout from "@/layouts/MainLayout";

const overLock = Overlock({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-over-lock",
});

export const metadata: Metadata = {
  title: "Soby to the moon",
  description:
    "The most memeable memecoin in existence. The dogs have had their day, it’s time for Soby to take reign.",
  openGraph: {
    images: [{ url: APP_SITE_URL + "/images/social-seo.png" }],
    title: "Soby to the moon",
    description:
      "The most memeable memecoin in existence. The dogs have had their day, it’s time for Soby to take reign.",
    siteName: "Soby meme",
    url: APP_SITE_URL,
  },
  twitter: {
    title: "Soby to the moon",
    description:
      "The most memeable memecoin in existence. The dogs have had their day, it’s time for Soby to take reign.",
    images: APP_SITE_URL + "/images/social-seo.png",
    site: APP_SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '');
        `}
      </Script>
      <body className={overLock.className}>
        <MainLayout>
          <WalletConnect>
            <AppContextProvider>
              <div className="w-full flex flex-col justify-between min-h-screen">
                <Header />
                <section className="mb-auto">{children}</section>
                <Footer />
              </div>
            </AppContextProvider>
          </WalletConnect>
        </MainLayout>

        <ToastContainer
          autoClose={3000}
          closeOnClick
          draggable={false}
          hideProgressBar={false}
          newestOnTop={false}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          position="top-right"
          rtl={false}
        />
      </body>
    </html>
  );
}
