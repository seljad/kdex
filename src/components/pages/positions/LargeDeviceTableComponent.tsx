import clsx from "clsx";
import DarkButtonComponent from "@/components/ui/buttons/DarkButtonComponent";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { useGetSwr } from "@/hooks/useGetSwr";
import { Spinner } from "@nextui-org/spinner";
import { TickMath } from "@uniswap/v3-sdk";
import { CalculatePriceValue } from "@/core/utils/GlobalContractMethods";
import { usePostSwr } from "@/hooks/usePostSwr";
import showToast from "@/core/utils/toastUtils";
import { Id } from "react-toastify";
import { useEffect, useState } from "react";
import { useSendTransaction } from "wagmi";
import { Address } from "viem";

function LargeDeviceTableComponent() {

  const { address } = useWalletConnect();
  const {
    data,
    mutate,
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
        "relative md:flex hidden min-h-[280px] items-start justify-center p-4",
        "border border-solid border-gray rounded-[20px]",
        "bg-[#131414]"
      )}>
      {
        isLoading ? <Spinner className={"absolute inset-0 m-auto"} size={"lg"} /> : items?.length === 0 ?
          <p className={"text-semibold14 absolute inset-0 m-auto flex items-center justify-center"}>You don’t have any position.</p> :
          <table className="w-full">
            <colgroup>
              <col className={"w-[6%]"} />
              <col className={"w-[20%]"} />
              <col className={"w-[20%]"} />
              <col className={"w-[20%]"} />
              <col className={"w-[20%]"} />
              <col className={"w-[14%]"} />
            </colgroup>
            <thead className={"bg-[#212121]"}>
            <tr className={""}>
              <th className="px-2 py-2 text-start text-regular14 text-gray1 rounded-l-xl">Number</th>
              <th className="px-2 py-2 text-start text-regular14 text-gray1">Fee tier</th>
              <th className="px-2 py-2 text-start text-regular14 text-gray1">Low Price</th>
              <th className="px-2 py-2 text-start text-regular14 text-gray1">High Price</th>
              {/*<th className="px-2 py-2 text-start text-regular14 text-gray1">Deposit amounts</th>*/}
              <th className="px-2 py-2 text-start text-regular14 text-gray1">Liquidity</th>
              <th className="px-2 py-2 text-start text-regular14 text-gray1 rounded-r-xl"></th>
            </tr>
            </thead>
            <tbody>
            {
              items?.filter((item) => item[7] !== "0").map((item: string[], index: number) => {
                const fee = (Number.parseFloat(item[4]) / 10000).toString();
                const lowPrice = CalculatePriceValue(TickMath.getSqrtRatioAtTick(Number.parseInt(item[5])).toString()).toString();
                const highPrice = CalculatePriceValue(TickMath.getSqrtRatioAtTick(Number.parseInt(item[6])).toString()).toString();
                const liquidity = item[7];

                return <tr>
                  <td className={"px-2 py-4 text-regular14 text-center"}>{index + 1}</td>
                  <td className={"px-2 py-4 text-regular14 text-[16px] font-medium"}>{fee}%</td>
                  <td className={"px-2 py-4 text-regular14"}>${lowPrice}</td>
                  <td className={"px-2 py-4 text-regular14"}>${highPrice}</td>
                  <td className={"px-2 py-4 text-regular14 align-middle"}>
                    {Number.parseFloat(liquidity).toLocaleString()}
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
                  </td>
                  <td className={"px-2 py-4 "}>
                    <DarkButtonComponent size={"sm"} onClick={() => {
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
                  </td>
                </tr>;
              })
            }
            </tbody>
          </table>
      }
    </div>
  );
}

export default LargeDeviceTableComponent;