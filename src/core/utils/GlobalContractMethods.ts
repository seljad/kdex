import { Address, formatEther } from "viem";
import { TestERC20ABI } from "@/config/abi";
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { wagmiAdapter } from "@/config/wagmi";
import showToast from "@/core/utils/toastUtils";
import { Id } from "react-toastify";
import { BigNumber } from "bignumber.js";
import { TickMath } from "@uniswap/v3-sdk";
import JSBI from "jsbi";

export const CheckAllowance = async ({ tokenAddress, contractAddress, value, walletAddress }: {
  tokenAddress: string,
  value: string,
  contractAddress: string,
  walletAddress: string
}): Promise<"need to approve" | "allowance ok" | "error"> => {
  const allowanceData = await readContract(wagmiAdapter.wagmiConfig, {
    address: tokenAddress as Address,
    abi: TestERC20ABI,
    functionName: "allowance",
    args: [walletAddress, contractAddress]
  });
  // 1 : allowance OK
  // 0 : need to approve
  // 2 : cannot parse data
  if (typeof allowanceData === "bigint") {
    const currentAllowance = formatEther(allowanceData, "wei");
    console.log("CURRENT ALLOWANCE: ", currentAllowance);
    if (Number.parseInt(currentAllowance) >= parseFloat(value)) {
      return "allowance ok";
    } else {
      return "need to approve";
    }
  }
  return "error";
};

export const CheckBalance = async ({ tokenAddress, walletAddress, value }: {
  tokenAddress: string,
  walletAddress: string,
  value: BigNumber,
}) => {
  const balanceData = await readContract(wagmiAdapter.wagmiConfig, {
    address: tokenAddress as Address,
    abi: TestERC20ABI,
    functionName: "balanceOf",
    args: [walletAddress]
  });

};

export const ApproveToken = async ({ tokenAddress, contractAddress, amount, walletAddress }: {
  tokenAddress: string,
  contractAddress: string,
  amount: bigint,
  walletAddress: string
}): Promise<boolean> => {

  let id = showToast({ type: "loading", message: "Approving token..." }) as Id;
  return await writeContract(wagmiAdapter.wagmiConfig, {
    address: tokenAddress as Address,
    abi: TestERC20ABI,
    functionName: "approve",
    account: walletAddress as Address,
    args: [contractAddress, amount]
  }).then(async (res) => {
    showToast({ type: "dismiss", id: id.toString() });
    id = showToast({ type: "loading", message: "Checking approve result..." }) as Id;
    console.log("RETURNED writeContractAsync RESPONSE: ", res);
    const transactionDetails = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: res
    });
    console.log("RETURNED transactionDetails RESPONSE: ", transactionDetails);
    if (transactionDetails.status === "success") {
      showToast({ type: "dismiss", id: id.toString() });
      showToast({ type: "success", message: "Approve Successfully!" });
      return true;
    } else {
      showToast({ type: "dismiss", id: id.toString() });
      showToast({ type: "error", message: "Error in checking approve result, check logs..." });
      console.log("Error in approve");
      return false;
    }
  }).catch((e) => {
    showToast({ type: "dismiss", id: id.toString() });
    showToast({ type: "error", message: "Error in approving token, check logs..." });
    console.log("RETURNED writeContractAsync ERROR: ", e);
    return false;
  });
};

export const TickCreator = (inputValue: string) => {
  return BigNumber(Math.sqrt(Number.parseFloat(inputValue)))
    .multipliedBy(BigNumber(2).pow(96))
    .toFixed()
    .split(".")[0];
};

export const TickMathCreator = (inputValue: string) => {
  return TickMath.getTickAtSqrtRatio(JSBI.BigInt(inputValue));
};

export const CalculatePriceValue = (rawPrice: string) => {
  const x192 = BigNumber(2).pow(192);
  const p = BigNumber(rawPrice).pow(2);
  return Number.parseFloat(p.div(x192).toString());
};

export const CheckIsTokenBigger = (token1: string, token2: string) => {
  return BigNumber(token1.toLowerCase()).isLessThan(token2.toLowerCase());
};
