export interface GetOnePairModel {
  pair?: Pair;
}

export interface Pair {
  token0?: Token;
  token1?: Token;
  _id?: string;
  pool?: string;
  fee?: number;
  price?: number;
  liquidity?: string;
}

export interface Token {
  balance?: number;
  address?: string;
}
