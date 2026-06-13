"use client";
import React, { ReactNode } from "react";
import ImageComponent from "@/components/ui/ImageComponent";
import noiseImage from "@/assets/images/noise.png";
import bgImage from "@/assets/images/bg_main.webp";
import bgStarsImage from "@/assets/images/bg_stars.svg";
import NavComponent from "@/components/ui/nav/NavComponent";
import { usePathname } from "next/navigation";

function LayoutHOC({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={"w-screen h-screen flex flex-col relative z-20"}>
      <ImageComponent src={noiseImage} alt={"noise"} className={"opacity-[0.02] w-screen h-full absolute -z-10"} />
      <ImageComponent src={pathname === "/home" ? bgImage : bgStarsImage} alt={"background"}
                      className={"w-screen h-full absolute -z-20"} />
      <NavComponent />
      <main className={"flex-grow z-20 overflow-scroll"}>
        {children}
      </main>
    </div>
  );
}

export default LayoutHOC;