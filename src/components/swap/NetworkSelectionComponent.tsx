import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import ImageComponent from "@/components/ui/ImageComponent";
import arrowDownIcon from "@/assets/icons/arrow_down.png";
import React from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { networks, networksIcons } from "@/config/wagmi";
import { TokenModel } from "@/data/model/TokenModel";

function NetworkSelectionComponent() {

  const { chains, switchChain } = useSwitchChain();
  const currentChainId = useChainId();

  return (
    <Dropdown classNames={{ content: "bg-black" }}>
      <DropdownTrigger className={"cursor-pointer"}>
        <div className={"w-full flex items-center justify-between"}>
          <div className={"flex items-center justify-end gap-2"}>
            <p className={"text-regular14 text-gray1"}>From</p>
            <div className={"flex items-center justify-start gap-[6px]"}>
              <ImageComponent src={networksIcons.find((item) => item.id === currentChainId)?.icon} alt={"eth"}
                              className={"w-4"} />
              <p
                className={"text-regular12 line-clamp-1"}>{networks.find((item) => item.id === currentChainId)?.name}</p>
            </div>
          </div>
          <ImageComponent src={arrowDownIcon} alt={"Arrow"} className={"w-4"} />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={chains} classNames={{ base: "bg-black" }}>
        {(item) => (
          <DropdownItem
            key={item.id}
            classNames={{ base: "!bg-black" }}
            className={"!bg-black !text-white"}
            onClick={() => {
              if (item.id)
                switchChain({ chainId: item.id });
            }}
          >
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default NetworkSelectionComponent;