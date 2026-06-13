import clsx from "clsx";
import DarkButtonComponent from "@/components/ui/buttons/DarkButtonComponent";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { useGetSwr } from "@/hooks/useGetSwr";
import { usePostSwr } from "@/hooks/usePostSwr";
import { useEffect, useState } from "react";
import { useSendTransaction } from "wagmi";
import { Spinner } from "@nextui-org/spinner";
import { CalculatePriceValue } from "@/core/utils/GlobalContractMethods";
import { TickMath } from "@uniswap/v3-sdk";
import showToast from "@/core/utils/toastUtils";
import { Id } from "react-toastify";
import { Address } from "viem";

function MobileViewComponent() {

  const { address } = useWalletConnect();
  const {
    data,
    isLoading
  } = useGetSwr(`/v1/user/positions?walletAddress=${address}&contract=0x27953460757073b2090E09FF2d7B28F1f21E1971`);
  const { trigger } = usePostSwr("/v1/hash/closeposition");
  const [items, setItems] = useState<Array<string[]> | undefined>(undefined);
  const { sendTransactionAsync: sendTransaction } = useSendTransaction();

  useEffect(() => {
    setItems(data?.data.positions);
  }, [data]);

  return (
    <div
      className={clsx(
        "md:hidden relative min-h-[280px] flex items-start justify-center",
        "",
        (items?.length ?? 0) > 0 ? "bg-transparent" : "bg-gradient-to-b from-[#070709] to-[#131414] border border-solid border-gray rounded-[20px] p-4",
        ""
      )}>
      {
        <div className={"w-full flex flex-col gap-6"}>
          {isLoading ? <Spinner
            className={"flex-grow"} /> : items?.length === 0 ?
            <p className={"text-semibold14 absolute inset-0 m-auto flex items-center justify-center"}>You don’t have any
              position.</p> : items?.filter((item) => item[7] !== "0").map((item: string[], index: number) => {
              const fee = (Number.parseFloat(item[4]) / 10000).toString();
              const lowPrice = CalculatePriceValue(TickMath.getSqrtRatioAtTick(Number.parseInt(item[5])).toString()).toString();
              const highPrice = CalculatePriceValue(TickMath.getSqrtRatioAtTick(Number.parseInt(item[6])).toString()).toString();
              const liquidity = item[7];

              return <div key={index}
                          className={"w-full bg-[#131414] rounded-2xl border border-solid border-gray px-4 py-5 flex flex-col gap-4"}>
                <div className={"flex flex-col gap-3"}>
                  <div className={"flex items-center justify-between"}>
                    <p className={"text-regular14 text-gray1"}>Number:</p>
                    <p className={"text-regular14"}>{index + 1}</p>
                  </div>
                  <div className={"flex items-center justify-between"}>
                    <p className={"text-regular14 text-gray1"}>fee tier:</p>
                    <p className={"text-regular14"}>{fee}%</p>
                  </div>
                  <div className={"flex items-center justify-between"}>
                    <p className={"text-regular14 text-gray1"}>Low Price::</p>
                    <p className={"text-regular14"}>${lowPrice}</p>
                  </div>
                  <div className={"flex items-center justify-between"}>
                    <p className={"text-regular14 text-gray1"}>High Price::</p>
                    <p className={"text-regular14"}>${highPrice}</p>
                  </div>
                  <div className={"flex items-center justify-between"}>
                    <p className={"text-regular14 text-gray1"}>Liquidity:</p>
                    <p className={"text-regular14"}>{Number.parseFloat(liquidity).toLocaleString()}</p>
                    {/*<div className={"flex items-center justify-start gap-4"}>*/}
                    {/*  <div className={"flex items-center justify-center gap-2"}>*/}
                    {/*    <ImageComponent src={ethIcon} alt={"eth"} className={"w-6"} />*/}
                    {/*    <p className={"text-regular14"}>123142</p>*/}
                    {/*  </div>*/}
                    {/*  <ImageComponent src={arrowRightIcon} alt={"eth"} className={"w-6"} />*/}
                    {/*  <div className={"flex items-center justify-center gap-2"}>*/}
                    {/*    <ImageComponent src={ethIcon} alt={"eth"} className={"w-6"} />*/}
                    {/*    <p className={"text-regular14"}>123142</p>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                  </div>
                </div>
                <DarkButtonComponent className={"!text-regular14 text-white !font-sans"} onClick={() => {
                  let id = showToast({ type: "loading", message: "Closing Position..." }) as Id;
                  trigger({
                    tokenId: item[8],
                    liquidity: liquidity,
                    amount0Min: "0",
                    amount1Min: "0",
                    deadline: Math.floor((Date.now() / 1000) + (5 * 60)).toString()
                  }).then((res) => {
                    const contractAddress = res.data.hash.to;
                    const data = res.data.hash.data;
                    showToast({ type: "dismiss", id: id.toString() });
                    id = showToast({ type: "loading", message: "Sending transaction..." }) as Id;
                    sendTransaction({
                      to: contractAddress as Address,
                      data: data as Address,
                      gas: BigInt(10062260)
                    }).then(() => {
                      showToast({ type: "dismiss", id: id.toString() });
                      showToast({ type: "success", message: "Position Closed" });
                      setItems((prevItems) => prevItems?.filter((_, i) => i !== index));
                    }).catch((error) => {
                      showToast({ type: "dismiss", id: id.toString() });
                      showToast({ type: "error", message: "Something went wrong, see logs" });
                      console.log("Error in creating new pool: ", error);
                    });
                  }).catch((error) => {
                    showToast({ type: "dismiss", id: id.toString() });
                    showToast({ type: "error", message: "Something went wrong, see logs" });
                  });
                }}>Close Position</DarkButtonComponent>
              </div>;
            })}
        </div>
      }
    </div>
  );
}

export default MobileViewComponent;