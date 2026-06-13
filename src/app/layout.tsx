import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { ReactNode } from "react";

import { fontSans, fontSpaceGrotesk } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { NextUIProvider } from "@nextui-org/react";
import ContextProviderWagmi from "@/components/hoc/ContextProviderWagmi";
import LayoutHOC from "@/components/hoc/LayoutHOC";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html suppressHydrationWarning lang="en">
    <body
      className={clsx(
        "w-screen min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontSpaceGrotesk.variable
      )}
    >
    <ContextProviderWagmi>
      <NextUIProvider>
        <LayoutHOC>
          {children}
        </LayoutHOC>
        <ToastContainer />
        <Toaster className={""} theme={"dark"} toastOptions={{
          classNames: {
            toast: "bg-black bg-opacity-90 border border-solid border-white border-opacity-20 px-2 py-3",
            title: "!text-regular14 !text-white"
          }
        }} position={"top-center"} />
      </NextUIProvider>
    </ContextProviderWagmi>
    </body>
    </html>
  );
}
