import { create } from "zustand";
import { TokenModel } from "@/data/model/TokenModel";

interface PositionState {
  token1?: TokenModel;
  token2?: TokenModel;
  updateToken1: (token: TokenModel) => void;
  updateToken2: (token: TokenModel) => void;
  updateFeeTier: (value: number) => void;
  feeTier: number;
  tickSpacing: number;
  lowPriceValue?: string;
  highPriceValue?: string;
  poolAddress?: string;
  price?: number;
  isFirstDepositChanged: boolean;
  isTokenBiggerSelected: boolean;
  depositAmountToken1Value?: string;
  depositAmountToken2Value?: string;
  updateLowPriceValue?: (value: string) => void;
  updateHighPriceValue?: (value: string) => void;
  updateDepositAmountToken1Value?: (value: string) => void;
  updateDepositAmountToken2Value?: (value: string) => void;
  updatePriceValue?: (value?: number) => void;
  updateTickSpacingValue?: (value?: number) => void;
  updateIsTokenBiggerValue?: (value?: boolean) => void;
  updateIsFirstDepositChangedValue?: (value?: boolean) => void;
  updatePoolAddressValue?: (value?: string) => void;
}

export const usePositionStore = create<PositionState>((set) => ({
  token1: undefined,
  token2: undefined,
  tickSpacing: 60,
  feeTier: 3000,
  lowPriceValue: "0",
  highPriceValue: "0",
  depositAmountToken1Value: "0",
  depositAmountToken2Value: "0",
  poolAddress: undefined,
  isTokenBiggerSelected: true,
  isFirstDepositChanged: true,
  updateToken1: (token: TokenModel) => {
    set(() => {
      return { token1: token };
    });
  },
  updateToken2: (token: TokenModel) => {
    set(() => {
      return { token2: token };
    });
  },
  updateFeeTier: (value) => {
    set(() => {
      return { feeTier: value };
    });
  },
  updateLowPriceValue: (value) => {
    set(() => {
      return { lowPriceValue: value };
    });
  },
  updateHighPriceValue: (value) => {
    set(() => {
      return { highPriceValue: value };
    });
  },
  updateDepositAmountToken1Value: (value) => {
    set(() => {
      return { depositAmountToken1Value: value };
    });
  },
  updateDepositAmountToken2Value: (value) => {
    set(() => {
      return { depositAmountToken2Value: value };
    });
  },
  updatePriceValue: (value) => {
    set(() => {
      return { price: value };
    });
  },
  updateTickSpacingValue: (value) => {
    set(() => {
      return { tickSpacing: value };
    });
  },
  updateIsTokenBiggerValue: (value) => {
    set(() => {
      return { isTokenBiggerSelected: value };
    });
  },
  updateIsFirstDepositChangedValue: (value) => {
    set(() => {
      return { isFirstDepositChanged: value };
    });
  },
  updatePoolAddressValue: (value) => {
    set(() => {
      return { poolAddress: value };
    });
  },
}));