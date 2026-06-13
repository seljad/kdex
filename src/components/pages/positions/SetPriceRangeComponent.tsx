import DarkButtonComponent from "@/components/ui/buttons/DarkButtonComponent";
import React, { useEffect } from "react";
import clsx from "clsx";
import { Input } from "@nextui-org/input";
import { usePositionStore } from "@/store/usePositionStore";
import { AxiosError } from "axios";
import { useGetSwr } from "@/hooks/useGetSwr";
import { CalculatePriceValue, CheckIsTokenBigger } from "@/core/utils/GlobalContractMethods";

function SetPriceRangeComponent() {

  const {
    token1,
    token2,
    updateHighPriceValue,
    updateLowPriceValue,
    highPriceValue,
    lowPriceValue,
    price,
    feeTier,
    isTokenBiggerSelected,
    updateIsTokenBiggerValue,
    updatePriceValue
  } = usePositionStore();
  const { mutate: mutateGetOnePair } = useGetSwr("/v1/pair/pair", { fetchOnMount: false });

  useEffect(() => {
    if (!token1?.address || !token2?.address) return;
    const isToken1Bigger = CheckIsTokenBigger(token1.address, token2.address);
    updateIsTokenBiggerValue?.(isToken1Bigger);
  }, [token1, token2]);

  useEffect(() => {
    if (!token1?.address || !token2?.address || !lowPriceValue || !highPriceValue) return;
    if (isTokenBiggerSelected) {
      const isToken1Smaller = CheckIsTokenBigger(token1.address, token2.address);
      mutateGetOnePair({
        token0: isToken1Smaller ? token1.address : token2.address,
        token1: isToken1Smaller ? token2.address : token1.address,
        fee: feeTier
      }).then((res) => {
        const finalPrice = CalculatePriceValue(res?.data.slot0);
        updatePriceValue?.(finalPrice);
        updateLowPriceValue?.((((finalPrice ?? 0) * 70) / 100).toString());
        updateHighPriceValue?.((((finalPrice ?? 0) * 130) / 100).toString());
      }).catch((e: AxiosError) => {
        if (e.status === 404) {
          updatePriceValue?.(0);
          updateLowPriceValue?.("0");
          updateHighPriceValue?.("0");
        }
      });
    } else {
      updateLowPriceValue?.(Math.pow(Number.parseFloat(lowPriceValue), -1).toString());
      updateHighPriceValue?.(Math.pow(Number.parseFloat(highPriceValue), -1).toString());
    }
  }, [isTokenBiggerSelected, token1, token2]);

  return (
    <div className={"flex flex-col items-stretch justify-stretch gap-3"}>
      <header className={"flex items-stretch md:items-center justify-between gap-3 md:flex-row flex-col"}>
        <p className={"text-semibold14 text-start"}>Set price range</p>
        <div className={"md:w-fit w-full flex items-center justify-center gap-3 flex-col-reverse md:flex-row "}>
          <DarkButtonComponent className={"md:w-fit w-full"} onClick={async () => {
            updateLowPriceValue?.("0");
            updateHighPriceValue?.("∞");
          }}>Full range</DarkButtonComponent>
          <div
            className={"md:w-[146px] w-full relative z-20 flex items-center justify-center bg-[#181818] border border-solid border-gray rounded-2xl p-1"}>
            <section
              className={clsx("flex-1 flex items-center justify-center text-center py-2 cursor-pointer", isTokenBiggerSelected ? "text-semibold14" : "text-regular14 text-gray1")}
              onClick={() => updateIsTokenBiggerValue?.(true)}>{token1?.name}</section>
            <section
              className={clsx("flex-1 text-center py-2 cursor-pointer", !isTokenBiggerSelected ? "text-semibold14" : "text-regular14 text-gray1")}
              onClick={() => updateIsTokenBiggerValue?.(false)}>{token2?.name}</section>
            <div
              className={clsx(
                "absolute top-1 left-1 w-[calc(100%/2-4px)] h-[calc(100%-8px)]",
                isTokenBiggerSelected ? "translate-x-0" : "translate-x-full",
                "-z-10 bg-[#212121] rounded-[12px] shadow-[0px_6px_16px_0px_#00000066,inset_0px_-2px_8px_0px_#FFFFFF14] transition-all"
              )} />
          </div>
        </div>
      </header>
      <div className={"bg-[#181818] rounded-xl p-3"}>
        <p className={"text-regular14 mb-2"}>Low price</p>
        <Input
          value={lowPriceValue}
          type={"number"}
          onValueChange={(value) => {
            updateLowPriceValue?.(value);
          }}
          classNames={{
            base: "bg-[#181818] rounded-xl p-0",
            mainWrapper: "gap-2",
            inputWrapper: "!bg-transparent !p-0 h-fit min-h-0",
            innerWrapper: "p-0",
            input: "!text-white !font-spaceGrotesk !font-bold !text-[20px]",
            helperWrapper: "p-0"
          }}
        />
        <p
          className={"text-regular12 text-gray1 mt-3"}>{isTokenBiggerSelected ? `${token1?.name} per ${token2?.name}` : `${token2?.name} per ${token1?.name}`}</p>
      </div>
      <div className={"bg-[#181818] rounded-xl p-3"}>
        <p className={"text-regular14 mb-2"}>High price</p>
        <Input
          value={highPriceValue}
          onValueChange={(value) => {
            updateHighPriceValue?.(value);
          }}
          type={"number"}
          classNames={{
            base: "bg-[#181818] rounded-xl p-0",
            mainWrapper: "gap-2",
            inputWrapper: "!bg-transparent !p-0 h-fit min-h-0",
            innerWrapper: "p-0",
            input: "!text-white !font-spaceGrotesk !font-bold !text-[20px]",
            helperWrapper: "p-0"
          }}
        />
        <p
          className={"text-regular12 text-gray1 mt-3"}>{isTokenBiggerSelected ? `${token1?.name} per ${token2?.name}` : `${token2?.name} per ${token1?.name}`}</p>
      </div>
      <p>1 {token1?.name} = {price} {token2?.name}</p>
    </div>
  );
}

export default SetPriceRangeComponent;