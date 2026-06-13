import { create } from "zustand";
import { TokenModel } from "@/data/model/TokenModel";

interface SwapState {
  token1?: TokenModel;
  token2?: TokenModel;
  valueInput1: string;
  valueInput2: string;
  rawValueInput1: string;
  rawValueInput2: string;
  bestRouteFinder: {
    token0?: { address?: string, name?: string };
    token1?: { address?: string, name?: string };
    token2?: { address?: string, name?: string };
  },
  updateRawValueInput1: (value: string) => void;
  updateRawValueInput2: (value: string) => void;
  isQuoteExactInput?: boolean;
  updateInput1: (value: string) => void;
  updateInput2: (value: string) => void;
  updateToken1: (token: TokenModel | undefined) => void;
  updateToken2: (token: TokenModel | undefined) => void;
  updateIsQuoteExactInput: (value: boolean) => void;
  settings: {
    slippage: "custom" | "auto";
    slippageValue?: number;
    transactionDeadline?: number;
  },
  updateSettings: ({ slippage, slippageValue, transactionDeadline }: {
    slippage: "custom" | "auto",
    slippageValue?: number,
    transactionDeadline?: number
  }) => void;
  updateBestRouteFinderValue: ({ token0, token1, token2 }: {
    token0?: { address?: string, name?: string },
    token1?: { address?: string, name?: string },
    token2?: { address?: string, name?: string },
  }) => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  token1: undefined,
  token2: undefined,
  valueInput1: "",
  valueInput2: "",
  rawValueInput1: "",
  rawValueInput2: "",
  isQuoteExactInput: true,
  bestRouteFinder: {},
  settings: {
    slippage: "auto"
  },
  updateSettings: ({ slippage, slippageValue, transactionDeadline }) => {
    set(() => {
      return { settings: { slippage, slippageValue, transactionDeadline } };
    });
  },
  updateInput1: (value) => {
    set(() => {
      return { valueInput1: value };
    });
  },
  updateInput2: (value) => {
    set(() => {
      return { valueInput2: value };
    });
  },
  updateRawValueInput1: (value) => {
    set(() => {
      return { rawValueInput1: value };
    });
  },
  updateRawValueInput2: (value) => {
    set(() => {
      return { rawValueInput2: value };
    });
  },
  updateToken1: (token) => {
    console.log("UPDADING");
    console.log(token);
    set(() => {
      return { token1: token };
    });
  },
  updateToken2: (token) => {
    set(() => {
      return { token2: token };
    });
  },
  updateIsQuoteExactInput: (value) => {
    set((state) => {
      if (state.isQuoteExactInput === value) return state;
      return { isQuoteExactInput: value };
    });
  },
  updateBestRouteFinderValue: ({ token0, token1, token2 }) => {
    set(() => {
      return {
        bestRouteFinder: {
          token0: { address: token0?.address, name: token0?.name },
          token1: { address: token1?.address, name: token1?.name },
          token2: { address: token2?.address, name: token2?.name }
        }
      };
    });
  }
}));