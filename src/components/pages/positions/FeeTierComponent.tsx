import React, { useEffect, useState } from "react";
import DarkButtonComponent from "@/components/ui/buttons/DarkButtonComponent";
import { usePositionStore } from "@/store/usePositionStore";
import clsx from "clsx";


function FeeTierComponent() {

  const { updateFeeTier, updateTickSpacingValue } = usePositionStore();
  const [show, setShow] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(1);
  const items = [
    {
      title: "0.01%",
      description: "Best for very stable pairs.",
      key: 0.01,
      tickSpacing: 10,
      feeTier: 100
    },
    {
      title: "0.3%",
      description: "Best for most pairs.",
      key: 0.3,
      tickSpacing: 60,
      feeTier: 3000
    },
    {
      title: "0.05%",
      description: "Best for stable pairs.",
      key: 0.05,
      tickSpacing: 10,
      feeTier: 500
    },
    {
      title: "1%",
      description: "Best for Exotic pairs.",
      key: 1,
      tickSpacing: 1000,
      feeTier: 10000
    }

  ];

  return (
    <div className={`w-full flex flex-col ${!show ? "gap-5" : "gap-0"} items-center justify-between transition-all`}>
      <div className={"bg-[#181818] rounded-xl p-3  w-full flex items-center justify-between"}>
        <p className={"text-semibold14"}>{items[selected].key}% Fee tier</p>
        <DarkButtonComponent className={""} size={"sm"}
                             onClick={() => setShow(!show)}>{show ? "Show" : "Hidden"}</DarkButtonComponent>
      </div>
      <div
        className={`w-full grid gap-5 md:grid-cols-2 grid-cols-1 overflow-hidden ${!show ? "max-h-[1000px]" : "max-h-0"} transition-all`}>
        {items.map((item, index) => {
          return <div key={index}
                      className={clsx(
                        `bg-[#181818] rounded-xl p-3 cursor-pointer border border-transparent border-solid ${selected === index ? "border-white" : ""}`,
                        index === 0 && "!cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (index === 0) return;
                        updateFeeTier(item.feeTier);
                        updateTickSpacingValue?.(item.tickSpacing);
                        setSelected(index);
                      }}>
            <p className={"text-semibold14"}>{item.title}</p>
            <p className={"text-regular14 text-gray1"}>{item.description}</p>
          </div>;
        })}
      </div>
    </div>
  );
}

export default FeeTierComponent;