"use client";
import React, { useEffect, useState } from "react";
import DropdownComponent from "@/components/ui/DropdownComponent";
import { Input } from "@nextui-org/input";
import ImageComponent from "@/components/ui/ImageComponent";
import ethIcon from "@/assets/icons/eth.svg";
import arrowRightIcon from "@/assets/icons/arrow_right2.svg";
import ConnectWalletButtonComponent from "@/components/ui/buttons/ConnectWalletButtonComponent";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import ButtonComponent from "@/components/ui/buttons/ButtonComponent";
import clsx from "clsx";
import NetworkSelectionComponent from "@/components/swap/NetworkSelectionComponent";
import SettingsComponent from "@/components/swap/SettingsComponent";
import { useGetSwr } from "@/hooks/useGetSwr";
import { useSwapStore } from "@/store/swapStore";
import { Address, formatUnits, parseUnits } from "viem";
import { usePostSwr } from "@/hooks/usePostSwr";
import { useSendTransaction } from "wagmi";
import showToast from "@/core/utils/toastUtils";
import { ApproveToken, CheckAllowance, CheckBalance } from "@/core/utils/GlobalContractMethods";
import { Id } from "react-toastify";
import { AxiosError } from "axios";
import { readContracts } from "@wagmi/core";
import { wagmiAdapter } from "@/config/wagmi";
import { Erc20Abi } from "@/data/abi/Erc20.abi";

function SwapComponent({ withOptions }: { withOptions?: boolean }) {

  const { sendTransactionAsync: sendTransaction } = useSendTransaction();
  const { isConnected, address } = useWalletConnect();
  const [isSwap, setIsSwap] = useState(true);
  const [isPriceImpact, setIsPriceImpact] = useState(false);
  const swapStore = useSwapStore();
  const { data: tokenListData } = useGetSwr("/v1/token/tokens");
  const { mutate: mutateQuoteExactInput } = useGetSwr("/v1/quote/quoteExactInput", { fetchOnMount: false });
  const { mutate: mutateQuoteExactOutput } = useGetSwr("/v1/quote/quoteExactOutput", { fetchOnMount: false });
  // const { trigger, isLoading } = usePostSwr(`/v1/hash/${swapStore.isQuoteExactInput ? "swapExactIn" : "swapExactOut"}`);
  const { trigger, isLoading } = usePostSwr(`/v1/hash/swapExactIn`);

  // Handle exact input quote update
  useEffect(() => {
    const fetchQuoteExactInput = async () => {
      if (swapStore.valueInput1 && swapStore.token1 && swapStore.token2 && swapStore.isQuoteExactInput) {
        mutateQuoteExactInput({
          token0: swapStore.token1.address,
          token1: swapStore.token2.address,
          amount: parseUnits(swapStore.valueInput1, swapStore.token1.decimals ?? 0)
        }).then((response) => {
          const formattedResult = formatUnits(response?.data?.result[0], swapStore.token1?.decimals ?? 0);
          swapStore.updateInput2(parseFloat(formattedResult).toFixed(4));
          swapStore.updateRawValueInput2(formattedResult);

          const token0Address = response?.data.bestRouteFinder.token0;
          const token1Address = response?.data.bestRouteFinder.token1;
          const token2Address = response?.data.bestRouteFinder.token2;
          const tokens: { address: string; name?: string }[] = [];
          if (token0Address) tokens.push({ address: token0Address });
          if (token1Address) tokens.push({ address: token1Address });
          if (token2Address) tokens.push({ address: token2Address });

          readContracts(wagmiAdapter.wagmiConfig, {
            contracts: tokens.map((item) => {
              return {
                abi: Erc20Abi,
                address: item.address as Address,
                functionName: "symbol"
              };
            })
          }).then((res) => {
            if (res[0]) {
              tokens[0].name = res[0].result as string;
            }
            if (res[1]) {
              tokens[1].name = res[1].result as string;
            }
            if (res[2]) {
              tokens[2].name = res[2].result as string;
            }
            swapStore.updateBestRouteFinderValue({
              token0: tokens[0],
              token1: tokens[1],
              token2: tokens[2]
            });
          });
          if (isPriceImpact)
            setIsPriceImpact(false);
        }).catch((error: AxiosError) => {
          if (error.status === 500) {
            setIsPriceImpact(true);
          }
        });
      }
    };
    fetchQuoteExactInput();
  }, [swapStore.valueInput1, swapStore.token1, swapStore.token2, swapStore.isQuoteExactInput]);

  // Handle exact output quote update
  useEffect(() => {
    const fetchQuoteExactOutput = async () => {
      if (swapStore.valueInput2 && swapStore.token1 && swapStore.token2 && !swapStore.isQuoteExactInput) {
        await mutateQuoteExactOutput({
          token0: swapStore.token2.address,
          token1: swapStore.token1.address,
          amount: parseUnits(swapStore.valueInput2, swapStore.token1.decimals ?? 0)
        }).then((response) => {
          const formattedResult = formatUnits(response?.data?.result[0], swapStore.token1?.decimals ?? 0);
          swapStore.updateInput1(parseFloat(formattedResult).toFixed(4));
          swapStore.updateRawValueInput1(formattedResult);
          const token0Address = response?.data.bestRouteFinder.token0;
          const token1Address = response?.data.bestRouteFinder.token1;
          const token2Address = response?.data.bestRouteFinder.token2;
          const tokens: { address: string; name?: string }[] = [];
          if (token0Address) tokens.push({ address: token0Address });
          if (token1Address) tokens.push({ address: token1Address });
          if (token2Address) tokens.push({ address: token2Address });

          readContracts(wagmiAdapter.wagmiConfig, {
            contracts: tokens.map((item) => {
              return {
                abi: Erc20Abi,
                address: item.address as Address,
                functionName: "symbol"
              };
            })
          }).then((res) => {
            if (res[0]) {
              tokens[0].name = res[0].result as string;
            }
            if (res[1]) {
              tokens[1].name = res[1].result as string;
            }
            if (res[2]) {
              tokens[2].name = res[2].result as string;
            }
            swapStore.updateBestRouteFinderValue({
              token0: tokens[0],
              token1: tokens[1],
              token2: tokens[2]
            });
          });
          if (isPriceImpact)
            setIsPriceImpact(false);
        }).catch((error: AxiosError) => {
          if (error.status === 500) {
            setIsPriceImpact(true);
          }
        });

      }
    };
    fetchQuoteExactOutput();
  }, [swapStore.valueInput2, swapStore.token1, swapStore.token2, swapStore.isQuoteExactInput]);

  const handleSwap = async () => {

    CheckBalance({
      tokenAddress: swapStore.token1!.address!,
      walletAddress: address!,
      value: parseUnits(swapStore.valueInput1, swapStore.token1?.decimals ?? 0),
    });

    return;
    if (!swapStore.token1?.address || !address) return;

    const isExactIn = swapStore.isQuoteExactInput;
    const settings = swapStore.settings;
    const amountIn = parseUnits(isExactIn ? swapStore.valueInput1 : swapStore.rawValueInput1, swapStore.token1?.decimals ?? 0);
    const amountOut = parseUnits(isExactIn ? swapStore.rawValueInput2 : swapStore.valueInput2, swapStore.token2?.decimals ?? 0);
    let amountOutMinimum;
    if (isExactIn) {
      amountOutMinimum = amountOut - (amountOut * BigInt(settings.slippageValue ?? 10) / BigInt(100));
    } else {
      // amountOutMinimum = amountIn + (amountIn * BigInt(settings.slippageValue ?? 10) / BigInt(100));
      amountOutMinimum = amountOut - (amountOut * BigInt(settings.slippageValue ?? 10) / BigInt(100));
    }
    const deadline = Date.now() + (settings.transactionDeadline ?? 10) * 60 * 1000;

    // token0: isExactIn ? swapStore.token1?.address : swapStore.token2?.address,
    // token1: isExactIn ? swapStore.token2?.address : swapStore.token1?.address,

    const data = {
      token0: swapStore.token1.address,
      token1: swapStore.token2?.address,
      amount: amountIn.toString(),
      slippage: amountOutMinimum.toString(),
      recipient: address,
      deadline,
      swapType: "ExactInput"
    };
    const response = await trigger(data);
    const contractAddress = response.data.hash.to;
    const allowanceStatus = await CheckAllowance({
      tokenAddress: swapStore.token1?.address,
      walletAddress: address,
      contractAddress: contractAddress,
      value: swapStore.rawValueInput1
    });

    let approveToken;
    if (allowanceStatus === "need to approve") {
      approveToken = await ApproveToken({
        tokenAddress: swapStore.token1?.address,
        contractAddress,
        amount: amountIn,
        walletAddress: address
      });
    } else if (allowanceStatus === "allowance ok") approveToken = true;

    if (approveToken) {
      const id = showToast({ type: "loading", message: "Sending transaction..." }) as Id;
      sendTransaction({
        to: contractAddress as Address,
        data: response.data.hash.data,
        gas: BigInt(10062260)
      }).then(() => {
        showToast({ type: "dismiss", id: id.toString() });
        showToast({ type: "success", message: "Transaction successfully!" });
      }).catch((error) => {
        showToast({ type: "dismiss", id: id.toString() });
        showToast({ type: "error", message: "Error in creating new pool..." });
        console.log("Error in creating new pool: ", error);
      });
    }
  };

  return (
    <div
      className={"md:w-[80%] w-full border border-solid border-gray bg-gradient-to-b from-[#070709] to-[#131414] p-3 rounded-3xl flex flex-col gap-4"}>
      {
        withOptions && <div
          className={"relative z-20 w-full flex items-center justify-center bg-[#181818] border border-solid border-gray rounded-2xl p-1"}>
          <section
            className={clsx("flex-1 text-center py-2 cursor-pointer", isSwap ? "text-semibold14" : "text-regular14 text-gray1")}
            onClick={() => {
              setIsSwap(true);
            }}>Swap
          </section>
          <section
            className={clsx("flex-1 text-center py-2 cursor-pointer", !isSwap ? "text-semibold14" : "text-regular14 text-gray1")}
            onClick={() => setIsSwap(false)}>Bridge
          </section>
          <div
            className={clsx(
              "absolute top-1 left-1 w-[calc(100%/2-4px)] h-[calc(100%-8px)]",
              isSwap ? "translate-x-0" : "translate-x-full",
              "-z-10 bg-[#212121] rounded-[12px] shadow-[0px_6px_16px_0px_#00000066,inset_0px_-2px_8px_0px_#FFFFFF14] transition-all"
            )} />
        </div>
      }
      <main className={"flex items-start justify-center lg:flex-row flex-col gap-3 bg-[#181818] rounded-[20px] p-3"}>
        <section className={"flex-1 flex flex-col gap-5"}>
          <div className={"w-full flex flex-col gap-2 items-start"}>
            <NetworkSelectionComponent />
            <DropdownComponent items={tokenListData?.data.tokens} isToken1={true} />
          </div>
          <div>
            <div>
              {/*<p className={"text-regular12"}>Your payment</p>*/}
              <Input placeholder={""} label={"Your payment"} className={""}
                     classNames={{
                       input: "border-none bg-transparent !text-white font-spaceGrotesk font-bold text-[2rem]",
                       inputWrapper: "text-white px-0 !bg-transparent group-data-[disabled=true]:bg-[#181818] group-data-[hover=true]:bg-[#181818] group-data-[invalid=true]:!bg-transparent",
                       mainWrapper: "text-white",
                       label: "text-[#A8A8A8] text-sm mb-10"
                     }}
                     value={swapStore.valueInput1}
                     onValueChange={(value) => {
                       swapStore.updateInput1(value);
                       swapStore.updateIsQuoteExactInput(true);
                     }}
              />
            </div>
            <p className={"mt-4 text-regular14 text-gray1"}>$637,410,000</p>
          </div>
        </section>
        <section className={"lg:w-fit w-full flex items-center justify-start lg:flex-col flex-row gap-8"}>
          <SettingsComponent />
        </section>
        <section className={"flex-1 flex flex-col gap-5"}>
          <div className={"flex flex-col gap-2 items-end"}>
            <NetworkSelectionComponent />
            <DropdownComponent items={tokenListData?.data.tokens} isToken1={false} />
          </div>
          <div>
            <div>
              {/*<p className={"text-regular12"}>You receive</p>*/}
              <Input placeholder={""} label={"Your payment"} className={""}
                     classNames={{
                       input: "border-none bg-transparent !text-white font-spaceGrotesk font-bold text-[2rem]",
                       inputWrapper: "text-white px-0 !bg-transparent group-data-[disabled=true]:bg-[#181818] group-data-[hover=true]:bg-[#181818] group-data-[invalid=true]:!bg-transparent",
                       mainWrapper: "text-white",
                       label: "text-[#A8A8A8] text-sm mb-10"
                     }}
                     value={swapStore.valueInput2}
                     onValueChange={(value) => {
                       swapStore.updateInput2(value);
                       swapStore.updateIsQuoteExactInput(false);
                     }}
              />
            </div>
            <p className={"mt-4 text-regular14 text-gray1"}>$637,410,000<span
              className={"text-regular12 text-red500 ms-2"}>(-99%)</span></p>
          </div>
        </section>
      </main>
      <footer className={"flex flex-col items-start justify-center gap-4"}>
        <div className={"w-full"}>
          {
            isConnected ? <ButtonComponent className={"w-full px-8"} onClick={handleSwap} loading={isLoading}
                                           disabled={isLoading || isPriceImpact}>{isPriceImpact ? "Very high price impact" : "Swap"}</ButtonComponent> :
              <ConnectWalletButtonComponent
                classname={"w-full bg-button-dark-gradient shadow-[0px_4px_10px_0px_#00000033]"} />
          }
        </div>
        <section className={""}>
          <p className={"text-regular14 text-gray1 mt-2 mb-[6px]"}>1 ETH = 134,36 WBTC ($61.051,88) <span
            className={"text-red-500"}>(-99%)</span></p>
          <p className={"text-regular14 text-gray1 mt-2 mb-[6px]"}>1 WBTC = 13,36 HBR ($6.032,88) <span
            className={"text-green-500"}>(+46%)</span></p>
          <div className={"flex items-center justify-start gap-4"}>
            <p className={"text-regular12 text-gray1"}>Best Route:</p>
            <div className={"flex items-center justify-center gap-[6px]"}>
              <ImageComponent src={ethIcon} alt={""} className={"w-4"} />
              <p className={"text-regular12"}>{swapStore.bestRouteFinder.token0?.name}</p>
            </div>
            <ImageComponent src={arrowRightIcon} alt={""} />
            <div className={"flex items-center justify-center gap-[6px]"}>
              <ImageComponent src={ethIcon} alt={""} className={"w-4"} />
              <p className={"text-regular12"}>{swapStore.bestRouteFinder.token1?.name}</p>
            </div>
            {
              swapStore.bestRouteFinder.token2?.name ? <>
                <ImageComponent src={arrowRightIcon} alt={""} />
                <div className={"flex items-center justify-center gap-[6px]"}>
                  <ImageComponent src={ethIcon} alt={""} className={"w-4"} />
                  <p className={"text-regular12"}>HBAR</p>
                </div>
              </> : null
            }
          </div>
        </section>
        <section className={"w-full flex items-center justify-center flex-col gap-3"}>
          <div className={"w-full"}>
            <div className={"w-full flex items-center justify-between gap-3 mb-[6px]"}>
              <span className={"text-regular12 text-gray1"}>Network fee:</span>
              <div className={"flex-grow border-[0.7px] border-gray border-dashed"} />
              <div className={"flex items-center justify-center"}>
                <ImageComponent src={ethIcon} alt={"e"} />
                <span className={"text-regular14"}>2 ETH</span>
              </div>
            </div>
            <div className={"flex items-center justify-between gap-3"}>
              <span className={"text-regular12 text-gray1"}>Platform fee:</span>
              <div className={"flex-grow border-[0.7px] border-gray border-dashed"} />
              <div className={"flex items-center justify-center"}>
                <ImageComponent src={ethIcon} alt={"e"} />
                <span className={"text-regular14"}>2 ETH</span>
              </div>
            </div>
          </div>
        </section>
      </footer>
    </div>
  );
}

export default SwapComponent;