"use client";
import CustomInput from "@/components/ui/input/CustomInput";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { useAccount, useWriteContract } from "wagmi";
import { Address, formatEther, isAddress, parseEther } from "viem";
import { FACTORY_ABI, QUOTER_ABI, SWAP_ROUTER_ABI, TestERC20ABI, UNISWAP_POOL_ABI } from "@/config/abi";
import { useAppKit } from "@reown/appkit/react";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { wagmiAdapter } from "@/config/wagmi";
import { factoryContract, quoterContract, swapRouterContract } from "@/config/GlobalConfigs";
import { useRouter } from "next/navigation";
import { BigNumber } from "bignumber.js";

// <span className={title({color: "violet"})}>beautiful&nbsp;</span>

type PoolResponse = {
  fee: string;
  liquidity: BigNumber;
};


export default function Home() {

  const { open } = useAppKit();
  const [fee, setFee] = useState("0");
  const { address, isConnected, isReconnecting } = useAccount();
  const router = useRouter();

  const [inputs, setInputs] = useState<{
    inputValue: string;
    inputToken: string;
    outputValue: string;
    outputToken: string;
  }>({
    inputValue: "",
    inputToken: "",
    outputValue: "0",
    outputToken: ""
  });

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    console.log(fee);
    if (isAddress(inputs.inputToken) && isAddress(inputs.outputToken) && !isNaN(parseInt(inputs.inputValue)) && fee !== "0") {
      readContract(wagmiAdapter.wagmiConfig, {
        address: quoterContract,
        abi: QUOTER_ABI,
        functionName: "quoteExactInputSingle",
        args: [{
          tokenIn: inputs.inputToken,
          tokenOut: inputs.outputToken,
          amountIn: parseEther(inputs.inputValue),
          fee: fee,
          sqrtPriceLimitX96: 0
        }]
      }).then((res) => {
        const value = (res as Array<bigint>)[0];
        console.log(value);
        console.log(formatEther(value));
        setInputs((prevState) => {
          return { ...prevState, outputValue: formatEther(value) };
        });
      });
    }
  }, [inputs.inputToken, inputs.outputToken, inputs.inputValue, fee]);

  const getPoolResponse = async (fee: string): Promise<Address | undefined> => {
    try {
      return await readContract(wagmiAdapter.wagmiConfig, {
        address: factoryContract as Address,
        abi: FACTORY_ABI,
        functionName: "getPool",
        args: [inputs.inputToken, inputs.outputToken, fee]
      }) as Address;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    if (!isAddress(inputs.inputToken) || !isAddress(inputs.outputToken)) return;
    const fees: string[] = ["500", "3000", "10000"];
    Promise.all(fees.map((fee) => getPoolResponse(fee))).then((addresses: (Address | undefined)[]) => {
      Promise.all(addresses.map((address, index) =>
        address ? getLiquidity(address).then((liquidity) => ({
          fee: fees[index],
          liquidity: BigNumber(liquidity)
        })) : undefined
      )).then((res: (PoolResponse | undefined)[]) => {
        const filteredRes = res.filter((item): item is PoolResponse => item !== undefined);
        const maxLiquidity = filteredRes.reduce((prev, current) => {
          return current.liquidity.gt(prev.liquidity) ? current : prev;
        });
        setFee(maxLiquidity.fee);
        console.log(`Fee with highest liquidity: ${maxLiquidity.fee}, Liquidity: ${maxLiquidity.liquidity.toString()}`);
      });
    });
  }, [getPoolResponse, inputs.inputToken, inputs.outputToken]);


  const getLiquidity = async (address: Address): Promise<BigNumber> => {
    try {
      return await readContract(wagmiAdapter.wagmiConfig, {
        address: address,
        abi: UNISWAP_POOL_ABI,
        functionName: "liquidity"
      }) as BigNumber;
    } catch {
      return BigNumber(0);
    }
  };

  const checkAllowance = async (): Promise<number> => {
    if (!isAddress(inputs.inputToken)) return 2;
    const allowanceData = await readContract(wagmiAdapter.wagmiConfig, {
      address: inputs.inputToken,
      abi: TestERC20ABI,
      functionName: "allowance",
      args: [address, swapRouterContract]
    });
    // 1 : allowance OK
    // 0 : need to approve
    // 2 : cannot parse data
    if (typeof allowanceData === "bigint") {
      const currentAllowance = formatEther(allowanceData, "wei");
      console.log("CURRENT ALLOWANCE: ", currentAllowance);
      if (Number.parseInt(currentAllowance) >= parseInt(inputs.inputValue)) {
        return 1;
      } else {
        return 0;
      }
    }
    return 2;
  };

  const approveToken = async (): Promise<boolean> => {
    if (!isAddress(inputs.inputToken)) return false;
    return await writeContractAsync({
      address: inputs.inputToken,
      abi: TestERC20ABI,
      functionName: "approve",
      account: address,
      args: [swapRouterContract, parseEther(inputs.inputValue)]
    }).then(async (res) => {
      console.log("RETURNED writeContractAsync RESPONSE: ", res);
      const transactionDetails = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
        hash: res
      });
      console.log("RETURNED transactionDetails RESPONSE: ", transactionDetails);
      if (transactionDetails.status === "success") {
        return true;
      } else {
        console.log("Error in approve");
        return false;
      }
    }).catch((e) => {
      console.log("RETURNED writeContractAsync ERROR: ", e);
      return false;
    });
  };

  const swapToken = async () => {
    if (!isAddress(inputs.inputToken)) return false;
    return await writeContractAsync({
      address: swapRouterContract,
      abi: SWAP_ROUTER_ABI,
      functionName: "exactInputSingle",
      account: address,
      args: [{
        tokenIn: inputs.inputToken,
        tokenOut: inputs.outputToken,
        amountIn: parseEther(inputs.inputValue),
        recipient: address,
        deadline: "100000000000000000000000000",
        amountOutMinimum: 0,
        fee: 500,
        sqrtPriceLimitX96: 0
      }]
    }).then(async (res) => {
      console.log("RETURNED SWAP RESPONSE: ", res);
      const transactionDetails = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
        hash: res
      });
      console.log("RETURNED transactionDetails RESPONSE: ", transactionDetails);
      if (transactionDetails.status === "success") {
        return true;
      } else {
        console.log("Error in approve");
        return false;
      }
    }).catch((e) => {
      console.log("RETURNED SWAP ERROR: ", e);
      return false;
    });
  };

  const handleProcess = async () => {
    const check = await checkAllowance();
    console.log("RETURNED checkAllowance FUNC: ", check);
    if (check === 0 || check === 2) {
      const isApproveDone: boolean = await approveToken();
      if (isApproveDone) {
        swapToken();
      }
    } else {
      swapToken();
    }
  };

  const handleClick = () => {
    if (isConnected && !isReconnecting) {
      handleProcess();
    } else {
      open();
    }
  };

  return (
    <Suspense>
      <div className="w-screen min-h-screen flex items-center justify-center bg-[#131313]">
        <div
          className={"md:w-1/3 w-[90%] border border-solid rounded-lg p-5 border-white flex flex-col items-center justify-center gap-4"}>
          <div className={"w-full flex items-center justify-center gap-3"}>
            <div className={"w-2/3"}>
              <CustomInput placeholder={"Enter amount value"}
                           type={"number"}
                           onChange={(e) => setInputs({ ...inputs, inputValue: e.target.value })}
                           value={inputs.inputValue} />
            </div>
            <CustomInput placeholder={"Enter token address"}
                         onChange={(e) => setInputs({ ...inputs, inputToken: e.target.value })}
                         value={inputs.inputToken} />
          </div>
          <div className={"w-full flex items-center justify-center flex-col gap-3"}>
            <CustomInput placeholder={"Enter output token address"}
                         onChange={(e) => setInputs({ ...inputs, outputToken: e.target.value })}
                         value={inputs.outputToken} />
            <p className={"text-white text-opacity-70 text-xs"}>You earn: {Number(inputs.outputValue).toFixed(2)}</p>
          </div>
          <Button className={"w-full text-black font-bold"}
                  onClick={handleClick}>{isConnected ? "Swap" : "Connect Wallet"}</Button>
          {
            isConnected && <p className={"text-white text-opacity-60 text-xs"}>Your address: {address}</p>
          }
          <Button className={"w-fit text-black font-bold"}
                  onClick={() => {
                    router.push("/pool");
                  }}>Create Pool</Button>
        </div>
      </div>
    </Suspense>
  );
}
