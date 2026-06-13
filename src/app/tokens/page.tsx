"use client";
import HeaderComponent from "@/components/pages/tokens/HeaderComponent";
import clsx from "clsx";
import ImageComponent from "@/components/ui/ImageComponent";
import ethIcon from "@/assets/icons/eth.svg";
import testChartIcon from "@/assets/images/test_chart.svg";
import DarkButtonComponent from "@/components/ui/buttons/DarkButtonComponent";
import { useEffect, useState } from "react";
import { useGetSwr } from "@/hooks/useGetSwr";
import { Spinner } from "@nextui-org/spinner";
import truncateString from "@/core/utils/strings";
import { useRouter } from "next/navigation";
import { useSwapStore } from "@/store/swapStore";
import { TokenModel } from "@/data/model/TokenModel";


function TokensPage() {

  const [selected, setSelected] = useState("Hot ones");
  const { data, isLoading } = useGetSwr("/v1/token/tokens");
  const [tokens, setTokens] = useState<any[]>();
  const { updateToken1 } = useSwapStore();
  const router = useRouter();

  useEffect(() => {
    setTokens(data?.data.tokens);
  }, [data]);

  return (
    <div
      className={"w-full h-full flex flex-wrap items-start justify-center md:gap-16 gap-10 px-main py-main text-center"}>
      <HeaderComponent />
      <div className={"w-full flex flex-col gap-6"}>
        <div className={"w-full flex flex-col gap-6  mb-5"}>
          <div
            className={clsx(
              "relative md:flex hidden min-h-[280px] items-start justify-center p-4",
              "border border-solid border-gray rounded-[20px]",
              "bg-[#131414]"
            )}>
            {
              isLoading ? <Spinner className={"absolute inset-0 m-auto"} size={"lg"} /> : <table className="w-full">
                <colgroup className={"w-full"}>
                  {/*icon*/}
                  <col className={"w-[3.5%]"} />
                  {/*name*/}
                  <col className={"w-[20%]"} />
                  {/*price*/}
                  <col className={"w-[18%]"} />
                  {/*24*/}
                  <col className={"w-[12%]"} />
                  {/*chart*/}
                  <col className={"w-[25%]"} />
                  {/*button*/}
                  <col className={"w-[20%]"} />
                </colgroup>
                <thead className={"w-full bg-[#212121]"}>
                <tr className={"w-full"}>
                  <th className="px-2 py-2 text-start text-regular14 text-gray1 rounded-l-xl"></th>
                  <th className="px-2 py-2 text-start text-regular14 text-gray1">Coin name</th>
                  <th className="px-2 py-2 text-start text-regular14 text-gray1">Last Price</th>
                  <th className="px-2 py-2 text-start text-regular14 text-gray1">24h Changes</th>
                  <th className="px-2 py-2 text-start text-regular14 text-gray1">Chart</th>
                  <th className="px-2 py-2 text-start text-regular14 text-gray1 rounded-r-xl"></th>
                </tr>
                </thead>
                <tbody>
                {
                  tokens?.map((item: any, index: number) => {
                    // if (item.symbol === "") {
                    //   readContract(wagmiAdapter.wagmiConfig, {
                    //     abi: Erc20Abi,
                    //     address: item.address as Address,
                    //     functionName: "symbol"
                    //   }).then((res) => {
                    //     setTokens((prev) => {
                    //       return prev?.map((item, i) =>
                    //         i === index ? { ...item, symbol: res } : item
                    //       );
                    //     });
                    //   });
                    // }
                    return <tr key={index}>
                      <td className={"align-middle"}>
                        <ImageComponent src={ethIcon} alt={"eth"} className={"m-auto w-6"} />
                      </td>
                      <td
                        className={"px-2 py-4 text-regular14 text-[16px] font-medium text-start line-clamp-1"}>{item.symbol === "" ? truncateString(item.address) : item.symbol}</td>
                      <td className={"px-2 py-4 text-regular14 text-start"}>$0</td>
                      <td className={"px-2 py-4 text-regular14 text-start"}>+0%</td>
                      <td className={"px-2 py-4 text-regular14 align-middle"}>
                        <ImageComponent src={testChartIcon} alt={"eth"} className={"w-[164px]"} />
                      </td>
                      <td className={"px-2 py-4"}><DarkButtonComponent size={"sm"}
                                                                       className={"ms-auto"} onClick={() => {
                        const tokenModel: TokenModel = {
                          _id: item._id,
                          address: item.address,
                          symbol: item.symbol,
                          decimals: item.decimals,
                          name: item.name
                        };
                        updateToken1(tokenModel);
                        router.push("/home");
                      }}>Trade</DarkButtonComponent>
                      </td>
                    </tr>;
                  })
                }
                </tbody>
              </table>
            }


            {/*<Tabs aria-label="Options" variant={"underlined"} classNames={{}} >*/}
            {/*  <Tab key="Hot ones" title={*/}
            {/*    <div className="flex items-center space-x-2">*/}
            {/*      <ImageComponent src={ethIcon} alt={"e"}/>*/}
            {/*      <span>Photos</span>*/}
            {/*    </div>*/}
            {/*  }>*/}
            {/*    /!*<Table/>*!/*/}
            {/*  </Tab>*/}
            {/*  <Tab key="New Coins" title="New Coins">*/}
            {/*    /!*<Table/>*!/*/}
            {/*  </Tab>*/}
            {/*  <Tab key="Most profit" title="Most profit">*/}
            {/*    /!*<Table/>*!/*/}
            {/*  </Tab>*/}
            {/*</Tabs>*/}
          </div>
          <div
            className={clsx(
              "md:hidden relative w-full flex flex-col gap-5",
            )}>
            {
              isLoading ? <Spinner className={"absolute inset-0 m-auto"} size={"lg"} /> : tokens?.map((item: any, index: number) => {
                return <div key={index}
                            className={"w-full bg-[#131414] rounded-2xl border border-solid border-gray px-4 py-5 flex flex-col gap-4"}>
                  <header>
                    <div className={"flex items-center justify-start gap-3"}>
                      <ImageComponent src={ethIcon} alt={"eth"} />
                      <p className={"font-medium text-base"}>{item.name}</p>
                    </div>
                  </header>
                  <div className={"flex items-center justify-between"}>
                    <p className={"text-regular14 text-gray1"}>Last Price:</p>
                    <p className={"text-regular14"}>0%</p>
                  </div>
                  <div className={"flex items-center justify-between"}>
                    <p className={"text-regular14 text-gray1"}>24h Changes:</p>
                    <p className={"text-regular14"}>0%</p>
                  </div>
                  <DarkButtonComponent
                                       className={"w-full"} onClick={() => {
                    const tokenModel: TokenModel = {
                      _id: item._id,
                      address: item.address,
                      symbol: item.symbol,
                      decimals: item.decimals,
                      name: item.name
                    };
                    updateToken1(tokenModel);
                    router.push("/home");
                  }}>Trade</DarkButtonComponent>
                </div>
              })
            }


            {/*<Tabs aria-label="Options" variant={"underlined"} classNames={{}} >*/}
            {/*  <Tab key="Hot ones" title={*/}
            {/*    <div className="flex items-center space-x-2">*/}
            {/*      <ImageComponent src={ethIcon} alt={"e"}/>*/}
            {/*      <span>Photos</span>*/}
            {/*    </div>*/}
            {/*  }>*/}
            {/*    /!*<Table/>*!/*/}
            {/*  </Tab>*/}
            {/*  <Tab key="New Coins" title="New Coins">*/}
            {/*    /!*<Table/>*!/*/}
            {/*  </Tab>*/}
            {/*  <Tab key="Most profit" title="Most profit">*/}
            {/*    /!*<Table/>*!/*/}
            {/*  </Tab>*/}
            {/*</Tabs>*/}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokensPage;