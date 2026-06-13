import React, { useEffect } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import ethIcon from "@/assets/icons/eth.svg";
import arrowDownIcon from "@/assets/icons/arrow_down.png";
import ImageComponent from "@/components/ui/ImageComponent";
import { TokenModel } from "@/data/model/TokenModel";
import { useSwapStore } from "@/store/swapStore";

function DropdownComponent({ items, isToken1, defaultToken }: {
  items: TokenModel[],
  isToken1: boolean,
  defaultToken?: TokenModel,
}) {

  const [selectedItem, setSelectedItem] = React.useState<TokenModel | undefined>();
  const { updateToken1, updateToken2, token1 } = useSwapStore();

  useEffect(() => {
    if (items) {

      if (isToken1) {
        setSelectedItem(token1 ?? items?.[0]);
        if (!token1)
          updateToken1(items?.[0]);
      } else {
        setSelectedItem(items?.[1]);
        updateToken2(items?.[1]);
      }
    }
  }, [items]);

  return (
    <Dropdown className={"w-full"} classNames={{ content: "bg-black" }}>
      <DropdownTrigger className={"w-full"}>
        <div
          className={"w-full flex items-center justify-between bg-[#212121] rounded-[32px] py-[6px] ps-2 pe-3 border border-solid border-gray cursor-pointer"}>
          <div className={"flex items-center justify-start"}>
            <ImageComponent src={ethIcon} alt={""} className={"bg-[#333333] rounded-full w-8 h-8 aspect-square p-1"} />
            <p className={"ms-2 me-8"}>{selectedItem?.name}</p>
          </div>
          <ImageComponent src={arrowDownIcon} alt={""} className={"w-4"} />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={items} classNames={{ base: "bg-black" }}>
        {(item?) => (
          <DropdownItem
            key={item?._id}
            classNames={{ base: "!bg-black" }}
            className={"!bg-black !text-white"}
            onClick={() => {
              if (item) {
                setSelectedItem(item);
                if (isToken1)
                  updateToken1(item);
                else
                  updateToken2(item);
              }
            }}
          >
            <div className={"flex items-center justify-start gap-3"}>
              {/*{item.icon && <ImageComponent src={item.icon} alt={"icon"}/>}*/}
              {item?.name === "" ? "Not found name" : item?.name}
            </div>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropdownComponent;