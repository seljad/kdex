import React from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import ImageComponent from "@/components/ui/ImageComponent";
import ethIcon from "@/assets/icons/eth.svg";
import arrowDownIcon from "@/assets/icons/arrow_down.png";
import { TokenModel } from "@/data/model/TokenModel";
import { usePositionStore } from "@/store/usePositionStore";
import { Input } from "@nextui-org/input";
import { Address, isAddress } from "viem";
import { readContracts } from "@wagmi/core";
import { wagmiAdapter } from "@/config/wagmi";
import { Erc20Abi } from "@/data/abi/Erc20.abi";

function PairDropdownComponent({ tokenList }: { tokenList: TokenModel[] }) {

  const { token1, token2, updateToken1, updateToken2 } = usePositionStore();

  return (
    <div className={"w-full"}>
      <p className={"text-semibold14 mb-3"}>Select pair</p>
      <div className={"flex flex-col gap-4"}>
        <div className={"w-full flex items-center justify-stretch gap-4 md:flex-row flex-col"}>
          <Dropdown className={"w-full"} classNames={{ content: "bg-black" }}>
            <DropdownTrigger className={"w-full"}>
              <div
                className={"w-full flex items-center justify-between bg-[#181818] rounded-[12px] p-[12px] cursor-pointer"}>
                <div className={"flex items-center justify-start gap-2"}>
                  <ImageComponent src={ethIcon} alt={""} className={"rounded-full w-6 h-6 aspect-square"} />
                  <p className={"text-semibold14"}>{token1?.name}</p>
                </div>
                <ImageComponent src={arrowDownIcon} alt={""} className={"w-4"}
                                style={{ filter: "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(6806%) hue-rotate(24deg) brightness(117%) contrast(100%)" }} />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions" items={tokenList}
                          classNames={{ base: "bg-black" }}>
              {(item) => (
                <DropdownItem
                  key={item?._id}
                  classNames={{ base: "!bg-black" }}
                  className={"!bg-black !text-white"}
                  onClick={() => {
                    updateToken1(item);
                  }}
                >
                  <div className={"flex items-center justify-start gap-3"}>
                    {/*{item.icon && <ImageComponent src={item.icon} alt={"icon"} />}*/}
                    {item?.name === "" ? "Not found name" : item?.name}
                  </div>
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          <Dropdown className={"w-full"} classNames={{ content: "bg-black" }}>
            <DropdownTrigger className={"w-full"}>
              <div
                className={"w-full flex items-center justify-between bg-[#181818] rounded-[12px] p-[12px] cursor-pointer"}>
                <div className={"flex items-center justify-start gap-2"}>
                  <ImageComponent src={ethIcon} alt={""} className={"rounded-full w-6 h-6 aspect-square"} />
                  <p className={"text-semibold14"}>{token2?.name}</p>
                </div>
                <ImageComponent src={arrowDownIcon} alt={""} className={"w-4"}
                                style={{ filter: "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(6806%) hue-rotate(24deg) brightness(117%) contrast(100%)" }} />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions" items={tokenList}
                          classNames={{ base: "bg-black" }}>
              {(item) => (
                <DropdownItem
                  key={item._id}
                  classNames={{ base: "!bg-black" }}
                  className={"!bg-black !text-white"}
                  onClick={() => {
                    updateToken2(item);
                  }}
                >
                  <div className={"flex items-center justify-start gap-3"}>
                    {/*{item.icon && <ImageComponent src={item.icon} alt={"icon"} />}*/}
                    {item?.name === "" ? "Not found name" : item?.name}
                  </div>
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className={"w-full flex items-center justify-stretch gap-4 md:flex-row flex-col"}>
          <Input placeholder={""} label={"Enter Custom Token"} className={""}
                 classNames={{
                   input: "border-none bg-transparent !text-white text-base",
                   inputWrapper: "text-white !bg-[#181818] group-data-[disabled=true]:bg-[#181818] group-data-[hover=true]:bg-[#181818] group-data-[invalid=true]:!bg-transparent",
                   mainWrapper: "text-white",
                   label: "text-[#A8A8A8] !text-sm"
                 }}
                 onValueChange={async (value) => {
                   if (!isAddress(value)) return;
                   readContracts(wagmiAdapter.wagmiConfig, {
                     contracts: [
                       {
                         abi: Erc20Abi,
                         address: value as Address,
                         functionName: "decimals"
                       },
                       {
                         abi: Erc20Abi,
                         address: value as Address,
                         functionName: "symbol"
                       }
                     ]
                   }).then((res) => {
                     const decimal = res[0].result as number;
                     const symbol = res[1].result as string;
                     const tokenModel: TokenModel = {
                       address: value,
                       name: symbol,
                       symbol: symbol,
                       decimals: decimal,
                       _id: value
                     };
                     updateToken1(tokenModel);
                   });
                 }}
          />
          <Input placeholder={""} label={"Enter Custom Token"} className={""}
                 classNames={{
                   input: "border-none bg-transparent !text-white text-base",
                   inputWrapper: "text-white !bg-[#181818] group-data-[disabled=true]:bg-[#181818] group-data-[hover=true]:bg-[#181818] group-data-[invalid=true]:!bg-transparent",
                   mainWrapper: "text-white",
                   label: "text-[#A8A8A8] !text-sm"
                 }}
                 onValueChange={async (value) => {
                   if (!isAddress(value)) return;
                   readContracts(wagmiAdapter.wagmiConfig, {
                     contracts: [
                       {
                         abi: Erc20Abi,
                         address: value as Address,
                         functionName: "decimals"
                       },
                       {
                         abi: Erc20Abi,
                         address: value as Address,
                         functionName: "symbol"
                       }
                     ]
                   }).then((res) => {
                     const decimal = res[0].result as number;
                     const symbol = res[1].result as string;
                     const tokenModel: TokenModel = {
                       address: value,
                       name: symbol,
                       symbol: symbol,
                       decimals: decimal,
                       _id: value
                     };
                     updateToken2(tokenModel);
                   });
                 }}
          />
        </div>
      </div>
    </div>
  );
}

export default PairDropdownComponent;