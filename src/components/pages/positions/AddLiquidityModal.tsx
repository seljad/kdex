import settingIcon from "@/assets/icons/setting.svg";
import exitIcon from "@/assets/icons/exit.svg";
import { ModalProps } from "@/data/model/ModalProps";
import CustomModal from "@/components/ui/modal/CustomModal";
import { ModalBody, ModalHeader } from "@nextui-org/modal";
import ImageComponent from "@/components/ui/ImageComponent";
import PairDropdownComponent from "@/components/pages/positions/PairDropdownComponent";
import ButtonComponent from "@/components/ui/buttons/ButtonComponent";
import FeeTierComponent from "@/components/pages/positions/FeeTierComponent";
import SetPriceRangeComponent from "@/components/pages/positions/SetPriceRangeComponent";
import DepositAmountsComponent from "@/components/pages/positions/DepositAmountsComponent";
import { usePositionStore } from "@/store/usePositionStore";
import { useGetSwr } from "@/hooks/useGetSwr";
import { useEffect, useRef } from "react";
import { Address, formatUnits, parseUnits } from "viem";
import { usePostSwr } from "@/hooks/usePostSwr";
import { AxiosError } from "axios";
import showToast from "@/core/utils/toastUtils";
import { useSendTransaction } from "wagmi";
import {
  ApproveToken,
  CalculatePriceValue,
  CheckAllowance,
  CheckIsTokenBigger,
  TickCreator,
  TickMathCreator
} from "@/core/utils/GlobalContractMethods";
import { Id } from "react-toastify";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { Spinner } from "@nextui-org/spinner";
import { TokenModel } from "@/data/model/TokenModel";
import { BigNumber } from "bignumber.js";

function AddLiquidityModal({ onClose, onOpenChange, isOpen }: ModalProps) {

  const {
    lowPriceValue,
    highPriceValue,
    depositAmountToken1Value,
    depositAmountToken2Value,
    feeTier,
    tickSpacing,
    token1,
    token2,
    isTokenBiggerSelected,
    isFirstDepositChanged,
    poolAddress,
    updatePriceValue,
    updateLowPriceValue,
    updateHighPriceValue,
    updateDepositAmountToken2Value,
    updateDepositAmountToken1Value,
    updatePoolAddressValue,
    updateToken2,
    updateToken1
  } = usePositionStore();
  const { data: tokenListData } = useGetSwr("/v1/token/tokens");
  const { mutate: mutateGetAmountForLiquidity } = useGetSwr("/v1/quote/getAmountForLiquidity", { fetchOnMount: false });
  const { mutate: mutateGetOnePair } = useGetSwr("/v1/pair/pair", { fetchOnMount: false });
  const { trigger: triggerNewPosition } = usePostSwr("/v1/hash/newposition");
  const { trigger: triggerCreatePool } = usePostSwr("/v1/hash/createPool");
  const { address } = useWalletConnect();
  const isProgrammaticUpdate = useRef(false);
  const { sendTransactionAsync: sendTransaction } = useSendTransaction();

  useEffect(() => {
    if (tokenListData?.data.tokens) {
      updateToken1(tokenListData?.data.tokens[0]);
      updateToken2(tokenListData?.data.tokens[1]);
    }
  }, [tokenListData]);

  // for getting price and check exist pool
  useEffect(() => {
    if (token1?.address && token2?.address && feeTier) {
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
        updatePoolAddressValue?.(res?.data.pair);
        console.log("finalPrice ", finalPrice);
      }).catch((e: AxiosError) => {
        if (e.status === 404) {
          updatePriceValue?.(0);
          updateLowPriceValue?.("0");
          updateHighPriceValue?.("0");
          updatePoolAddressValue?.(undefined);
        }
      });
    }
  }, [
    token1, token2, feeTier
  ]);

  useEffect(() => {
    if (isProgrammaticUpdate.current) return;
    if (!token1?.address || !token2?.address) return;
    if (isFirstDepositChanged && (!depositAmountToken1Value || depositAmountToken1Value === "0")) return;
    if (!isFirstDepositChanged && (!depositAmountToken2Value || depositAmountToken2Value === "0")) return;
    if (!lowPriceValue || lowPriceValue === "0" || !highPriceValue || highPriceValue === "0") return;
    if (!poolAddress) return;
    isProgrammaticUpdate.current = true;

    const data: {
      tickLower: string,
      tickUpper: string,
      amount0: string,
      amount1: string,
      token0: string,
      token1: string,
      fee: number,
      aToB: boolean,
    } = {
      tickLower: "",
      tickUpper: "",
      amount0: isFirstDepositChanged ? parseUnits(depositAmountToken1Value!, token1.decimals ?? 1).toString() : "0",
      amount1: !isFirstDepositChanged ? parseUnits(depositAmountToken2Value!, token2.decimals ?? 1).toString() : "0",
      token0: "",
      token1: "",
      fee: 0,
      aToB: isFirstDepositChanged
    };

    const isToken1Smaller = CheckIsTokenBigger(token1.address, token2.address);

    if (isToken1Smaller) {
      data.token0 = token1.address;
      data.token1 = token2.address;
    } else {
      data.token0 = token2.address;
      data.token1 = token1.address;
    }

    const ticks = getTickValues();
    data.tickLower = ticks.tickLower.toString();
    data.tickUpper = ticks.tickUpper.toString();

    data.fee = feeTier;

    mutateGetAmountForLiquidity(data).then((res) => {
      if (isFirstDepositChanged) {
        updateDepositAmountToken2Value?.(Math.round(Number.parseFloat(formatUnits(res?.data.amountLiquidity[2], token2.decimals ?? 1))).toString());
      } else {
        updateDepositAmountToken1Value?.(Math.round(Number.parseFloat(formatUnits(res?.data.amountLiquidity[1], token1.decimals ?? 1))).toString());
      }
    }).finally(() => {
      isProgrammaticUpdate.current = false;
    });

  }, [token1, token2, lowPriceValue, highPriceValue, depositAmountToken1Value, depositAmountToken2Value]);

  const handleCreatePosition = () => {
    if (!address || !depositAmountToken1Value || !depositAmountToken2Value ||
      depositAmountToken1Value === "0" || depositAmountToken2Value === "0" ||
      depositAmountToken1Value === "" || depositAmountToken2Value === "" ||
      !token1?.address || !token2?.address || !lowPriceValue || lowPriceValue === "0" || lowPriceValue === "" ||
      !highPriceValue || highPriceValue === "0" || highPriceValue === "") return;

    const isToken1Smaller = CheckIsTokenBigger(token1.address, token2.address);

    const data = {
      token0: token1?.address,
      token1: token2?.address,
      fee: feeTier,
      tickLower: "",
      tickUpper: "",
      amount0Desired: "",
      amount1Desired: "",
      amount0Min: "",
      amount1Min: "",
      recipient: "",
      deadline: ""
    };


    if (isToken1Smaller) {
      data.token0 = token1.address;
      data.token1 = token2.address;
    } else {
      data.token0 = token2.address;
      data.token1 = token1.address;
    }

    const ticks = getTickValues();
    data.tickLower = ticks.tickLower.toString();
    data.tickUpper = ticks.tickUpper.toString();

    data.amount0Desired = parseUnits(depositAmountToken1Value, token1.decimals ?? 1).toString();
    data.amount1Desired = parseUnits(depositAmountToken2Value, token2.decimals ?? 1).toString();

    data.amount0Min = parseUnits(((Number.parseFloat(depositAmountToken1Value ?? 0)) * 0.80).toString(), token1.decimals ?? 1).toString();
    data.amount1Min = parseUnits(((Number.parseFloat(depositAmountToken2Value ?? 0)) * 0.80).toString(), token2.decimals ?? 1).toString();

    data.recipient = address?.toString();
    data.deadline = Math.floor((Date.now() / 1000) + (5 * 60)).toString();

    if (poolAddress) {
      triggerNewPosition(data).then(async (response) => {
        const contractAddress = response.data.hash.to;
        const data = response.data.hash.data;
        await sendingTransaction({ contractAddress, data });
      });
    } else {
      // data.amount1Desired = parseUnits(depositAmountToken2Value, token2.decimals ?? 1).toString();

      data.amount0Min = "0";
      data.amount1Min = "0";

      triggerCreatePool({
        ...data,
        price: BigNumber(Number.parseFloat(depositAmountToken1Value) / Number.parseFloat(depositAmountToken2Value)).multipliedBy(BigNumber(2).pow(96)).toFixed().split(".")[0]
      }).then(async (response) => {
        const contractAddress = response.data.hash.to;
        const data = response.data.hash.data;
        await sendingTransaction({ contractAddress, data });
      });
    }
    return;
  };

  const sendingTransaction = async ({ contractAddress, data }: { contractAddress: string, data: string }) => {
    if (!address || !depositAmountToken1Value || !depositAmountToken2Value || depositAmountToken1Value === "0" || depositAmountToken1Value === "" || !token1?.address || !token2?.address) return;
    const allowanceStatusToken1 = await CheckAllowance({
      tokenAddress: token1.address!,
      walletAddress: address,
      contractAddress: contractAddress,
      value: depositAmountToken1Value
    });
    const allowanceStatusToken2 = await CheckAllowance({
      tokenAddress: token2.address!,
      contractAddress,
      walletAddress: address,
      value: depositAmountToken2Value
    });
    let approveToken1;
    let approveToken2;
    if (allowanceStatusToken1 === "need to approve") {
      approveToken1 = await ApproveToken({
        tokenAddress: token1.address!,
        contractAddress,
        amount: parseUnits(depositAmountToken1Value!, token1.decimals ?? 1),
        walletAddress: address
      });
    } else if (allowanceStatusToken1 === "allowance ok") approveToken1 = true;
    if (allowanceStatusToken2 === "need to approve") {
      approveToken2 = await ApproveToken({
        tokenAddress: token2.address!,
        contractAddress,
        amount: parseUnits(depositAmountToken2Value!, token2.decimals ?? 1),
        walletAddress: address
      });
    } else if (allowanceStatusToken2 === "allowance ok") approveToken2 = true;
    if (approveToken1 && approveToken2) {
      const id = showToast({ type: "loading", message: "Sending transaction..." }) as Id;
      sendTransaction({ to: contractAddress as Address, data: data as Address, gas: BigInt(10062260) }).then(() => {
        showToast({ type: "dismiss", id: id.toString() });
        showToast({ type: "success", message: "Transaction successfully!" });
      }).catch((error) => {
        showToast({ type: "dismiss", id: id.toString() });
        showToast({ type: "error", message: "Error in creating new pool..." });
        console.log("Error in creating new pool: ", error);
      });
    }
  };

  const getTickValues = () => {
    try {
      const isFullRange = highPriceValue === "∞";
      if (isFullRange) {
        const minTick = -887272;
        const maxTick = +887272;
        const tempTickLower = Math.floor(minTick / tickSpacing) * tickSpacing;
        const tempTickUpper = Math.floor(maxTick / tickSpacing) * tickSpacing;
        return { tickLower: tempTickLower, tickUpper: tempTickUpper };
      } else {
        const tempTickLowerRaw = TickCreator(isTokenBiggerSelected ? lowPriceValue! : Math.pow(Number.parseFloat(lowPriceValue!), -1).toString());
        const tempTickUpperRaw = TickCreator(isTokenBiggerSelected ? highPriceValue! : Math.pow(Number.parseFloat(highPriceValue!), -1).toString());
        const tempTickLower = TickMathCreator(tempTickLowerRaw);
        const tempTickUpper = TickMathCreator(tempTickUpperRaw);
        const tickLower = Math.floor(tempTickLower / tickSpacing) * tickSpacing;
        const tickUpper = Math.floor(tempTickUpper / tickSpacing) * tickSpacing;
        return {
          tickUpper: isTokenBiggerSelected ? tickUpper : tickLower,
          tickLower: isTokenBiggerSelected ? tickLower : tickUpper
        };
      }
    } catch (e) {
      isProgrammaticUpdate.current = false;
      showToast({ type: "error", message: "Error in calculate ticks, see logs" });
      console.log(e);
      return { tickLower: 0, tickUpper: 0 };
    }
  };

  return (
    <CustomModal show={isOpen} onOpenChange={onOpenChange} scrollBehavior={"inside"} size="xl" placement={"center"}
                 baseClassName={""}>
      <ModalHeader className="px-4 py-3 flex items-center justify-between border-b border-solid border-gray">
        <div className={"flex items-center justify-center gap-2"}>
          <ImageComponent src={settingIcon} alt={"settingIcon"} className={"w-5 cursor-pointer"} />
          <p className={"font-spaceGrotesk font-bold"}>Add liquidity</p>
        </div>
        <ImageComponent src={exitIcon} alt={"exit"} onClick={() => {
          onClose();
        }} className={"cursor-pointer"} />
      </ModalHeader>
      <ModalBody className="w-full flex flex-col gap-6 items-stretch justify-stretch px-4 py-4">
        {
          !token1 || !token2 ? <div className={"min-h-[70vh] flex items-center justify-center"}>
            <Spinner />
          </div> : <>
            <section aria-label={"pair"} className={"w-full"}>
              <PairDropdownComponent tokenList={tokenListData?.data?.tokens as TokenModel[]} />
            </section>
            <section aria-label={"fee tier"} className={"w-full"}>
              <p className={"text-semibold14 mb-3"}>fee tier</p>
              <FeeTierComponent />
            </section>
            <section aria-label={"Set price range"} className={"w-full"}>
              <SetPriceRangeComponent />
            </section>
            <section aria-label={"Deposit amounts"} className={"w-full"}>
              <DepositAmountsComponent />
            </section>
            <footer>
              <ButtonComponent className={"w-full"} onClick={handleCreatePosition}>
                New Position
              </ButtonComponent>
            </footer>
          </>
        }
      </ModalBody>
    </CustomModal>
  );
}

export default AddLiquidityModal;