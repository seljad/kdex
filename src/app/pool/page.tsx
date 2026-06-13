"use client";

import { Suspense, useEffect, useState } from "react";
import CustomInput from "@/components/ui/input/CustomInput";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useWriteContract } from "wagmi";
import { Address, formatEther, hexToBigInt, isAddress, parseEther } from "viem";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { wagmiAdapter } from "@/config/wagmi";
import { FACTORY_ABI, POSITION_MANAGER_ABI, TestERC20ABI } from "@/config/abi";
import { factoryContract, positionManagerContract } from "@/config/GlobalConfigs";
import { encodePriceSqrt } from "@/config/test";

function Page() {

  const [inputs, setInputs] = useState<{
    tokenOneAddress: string,
    tokenOneValue: string,
    tokenTwoAddress: string,
    tokenTwoValue: string,
    fee: string
  }>({
    tokenOneAddress: "",
    tokenOneValue: "",
    tokenTwoAddress: "",
    tokenTwoValue: "",
    fee: ""
  });

  // tokenOneAddress: "0xC8de62E937783CBFC68f5dB2FC883408B5808C8D",
  //   tokenOneValue: "",
  //   tokenTwoAddress: "0xFdE0F268294f086D4a0a6ED9727Fb4893A63553c",
  //   tokenTwoValue: "",
  //   fee: ""

  const [isCreatedPool, setIsCreatedPool] = useState<boolean | undefined>(undefined);
  // const [liquidity, setLiquidity] = useState<bigint | undefined>(undefined);

  const { open } = useAppKit();
  const { address, isConnected, isReconnecting } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // const provider = useEthersProvider();
  // const signer = useEthersSigner();

  useEffect(() => {
    if (isAddress(inputs.tokenOneAddress) && isAddress(inputs.tokenTwoAddress) && inputs.fee !== "") {
      readContract(wagmiAdapter.wagmiConfig, {
        address: factoryContract,
        abi: FACTORY_ABI,
        functionName: "getPool",
        args: [inputs.tokenOneAddress, inputs.tokenTwoAddress, inputs.fee]
      }).then((poolAddress) => {
        console.log("RETURNED getPool RESPONSE: ", poolAddress);
        if (poolAddress === "0x0000000000000000000000000000000000000000") {
          setIsCreatedPool(false);
        } else {
          setIsCreatedPool(false);
        }
      });
    }
  }, [inputs.tokenOneAddress, inputs.tokenTwoAddress, inputs.fee]);

  const checkAllowanceAndApprove = async (tokenAddress: string, requirementValue: string): Promise<boolean> => {
    if (!isAddress(tokenAddress)) return false;
    const allowanceData = await readContract(wagmiAdapter.wagmiConfig, {
      address: tokenAddress,
      abi: TestERC20ABI,
      functionName: "allowance",
      args: [address, positionManagerContract]
    });
    // 1 : allowance OK
    // 0 : need to approve
    // 2 : cannot parse data
    if (typeof allowanceData === "bigint") {
      const currentAllowance = formatEther(allowanceData, "wei");
      console.log("CURRENT ALLOWANCE: ", allowanceData);
      const isAllowanceOK = Number.parseInt(currentAllowance) >= parseInt(requirementValue);
      if (isAllowanceOK) return true;
      return approveToken(tokenAddress, requirementValue).then((res) => {
        return res;
      }).catch(() => {
        return false;
      });
    }
    return false;
  };

  const approveToken = async (tokenAddress: string, requirementValue: string): Promise<boolean> => {
    if (!isAddress(tokenAddress)) return false;
    return await writeContractAsync({
      address: tokenAddress,
      abi: TestERC20ABI,
      functionName: "approve",
      account: address,
      args: [positionManagerContract, parseEther(requirementValue)]
    }).then(async (res) => {
      console.log("RETURNED approve RESPONSE: ", res);
      const transactionDetails = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
        hash: res
      });
      console.log("RETURNED approve RESPONSE: ", transactionDetails);
      if (transactionDetails.status === "success") {
        return true;
      } else {
        console.log("Error in approve");
        return false;
      }
    }).catch((e) => {
      console.log("RETURNED approve ERROR: ", e);
      return false;
    });
  };

  const handleProcess = async () => {
    if (!isAddress(inputs.tokenOneAddress) && !isAddress(inputs.tokenTwoAddress)) return;
    if (!isCreatedPool) {
      console.log([inputs.tokenOneAddress, inputs.tokenTwoAddress, inputs.fee, encodePriceSqrt(parseEther(inputs.tokenOneValue), parseEther(inputs.tokenTwoValue)).toString()]);

      // const contract = new ethers.Contract(positionManagerContract, POSITION_MANAGER_INTERFACE, signer);
      // await contract.createAndInitializePoolIfNecessary(
      //   inputs.tokenOneAddress, inputs.tokenTwoAddress, inputs.fee, encodePriceSqrt(parseEther(inputs.tokenOneValue), parseEther(inputs.tokenTwoValue)).toString(),
      //   {
      //     gasPrice: 20000000000,
      //     gasLimit: 7721975
      //   }
      // ).then(async (res) => {
      //   console.log("RETURNED createAndInitializePoolIfNecessary RESPONSE: ", res);
      //   const transactionDetails = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      //     hash: res
      //   });
      //   console.log("RETURNED createAndInitializePoolIfNecessary RESPONSE: ", transactionDetails);
      //   if (transactionDetails.status === "success") {
      //     await mint();
      //   } else {
      //     console.log("Error in createAndInitializePoolIfNecessary");
      //     return false;
      //   }
      // }).catch((e) => {
      //   console.log("RETURNED createAndInitializePoolIfNecessary ERROR: ", e);
      //   return false;
      // });

      const addresses = sortAddressesByHexValue(inputs.tokenOneAddress as Address, inputs.tokenTwoAddress as Address);
      writeContractAsync({
        address: positionManagerContract,
        abi: POSITION_MANAGER_ABI,
        functionName: "createAndInitializePoolIfNecessary",
        account: address,
        args: [addresses[0], addresses[1], inputs.fee, encodePriceSqrt(parseEther(inputs.tokenOneValue), parseEther(inputs.tokenTwoValue)).toString()]
      }).then(async (res) => {
        console.log("RETURNED createAndInitializePoolIfNecessary RESPONSE: ", res);
        const transactionDetails = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
          hash: res
        });
        console.log("RETURNED createAndInitializePoolIfNecessary RESPONSE: ", transactionDetails);
        if (transactionDetails.status === "success") {
          await mint();
        } else {
          console.log("Error in createAndInitializePoolIfNecessary");
          return false;
        }
      }).catch((e) => {
        console.log("RETURNED createAndInitializePoolIfNecessary ERROR: ", e);
        return false;
      });
    } else {
      await mint();
    }
  };

  function sortAddressesByHexValue(address1: Address, address2: Address): [string, string] {
    const hexOne = hexToBigInt(address1);
    const hexTwo = hexToBigInt(address2);
    return hexOne < hexTwo ? [address1, address2] : [address2, address1];
  }

  const mint = async () => {
    const checkTokenOne = await checkAllowanceAndApprove(inputs.tokenOneAddress, inputs.tokenOneValue);
    const checkTokenTwo = await checkAllowanceAndApprove(inputs.tokenTwoAddress, inputs.tokenTwoValue);

    if (checkTokenOne && checkTokenTwo) {
      const tickSpacing = inputs.fee === "500" ? (10) : inputs.fee === "3000" ? 60 : 200;
      const tickLower = Math.floor(887272 / tickSpacing) * tickSpacing * -1;
      const tickUpper = Math.floor(887272 / tickSpacing) * tickSpacing;
      const addresses = sortAddressesByHexValue(inputs.tokenOneAddress as Address, inputs.tokenTwoAddress as Address);
      writeContractAsync({
        address: positionManagerContract,
        abi: POSITION_MANAGER_ABI,
        functionName: "mint",
        account: address,
        args: [{
          token0: addresses[0],
          token1: addresses[1],
          fee: inputs.fee,
          tickLower: tickLower.toString(),
          tickUpper: tickUpper.toString(),
          amount0Desired: parseEther(inputs.tokenOneValue),
          amount1Desired: parseEther(inputs.tokenTwoValue),
          amount0Min: "0",
          amount1Min: "0",
          recipient: address,
          deadline: "1000000000000"
        }]
      }).then(() => {

      });
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
          <p className={"text-white"}>Add liquidity</p>
          <CustomInput placeholder={"Enter token address one"}
                       onChange={(e) => setInputs({ ...inputs, tokenOneAddress: e.target.value })}
                       value={inputs.tokenOneAddress} />
          <CustomInput placeholder={"Enter token address two"}
                       onChange={(e) => setInputs({ ...inputs, tokenTwoAddress: e.target.value })}
                       value={inputs.tokenTwoAddress} />
          <RadioGroup
            label="fee tier"
            value={inputs.fee}
            className={"w-full"}
            classNames={{
              wrapper: "flex-row my-1 gap-4"
            }}
            onValueChange={(e) => {
              setInputs({ ...inputs, fee: e });
            }}>
            {/*<Radio value="100" size={"sm"} classNames={{ label: "text-white text-xs" }}>0.01%</Radio>*/}
            <Radio value="500" size={"sm"} classNames={{ label: "text-white text-xs" }}>0.05%</Radio>
            <Radio value="3000" size={"sm"} classNames={{ label: "text-white text-xs" }}>0.30%</Radio>
            <Radio value="10000" size={"sm"} classNames={{ label: "text-white text-xs" }}>1.00%</Radio>
          </RadioGroup>
          <div className={"w-full flex items-center justify-center gap-4"}>
            <CustomInput placeholder={"value token one"}
                         type={"number"}
                         onChange={(e) => setInputs({ ...inputs, tokenOneValue: e.target.value })}
                         value={inputs.tokenOneValue} />
            <CustomInput placeholder={"value token two"}
                         type={"number"}
              // readOnly={Number(formatEther(liquidity ?? BigInt(0))) > 0}
                         onChange={(e) => setInputs({ ...inputs, tokenTwoValue: e.target.value })}
                         value={inputs.tokenTwoValue} />
          </div>
          <Button className={`w-full text-black font-bold ${isCreatedPool ? "cursor-none" : "cursor-pointer"}`}
                  disabled={isCreatedPool}
                  onClick={handleClick}>{isConnected ? "Create" : "Connect Wallet"}</Button>
          {
            isConnected && <p className={"text-white text-opacity-60 text-xs"}>Your address: {address}</p>
          }
        </div>
      </div>
      {

      }
    </Suspense>
  );
}

export default Page;