import bn, { BigNumber } from "bignumber.js";
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

export function encodePriceSqrt(reserve1: bigint, reserve0: bigint): BigNumber {
  return BigNumber(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(192))
      .integerValue(3)
      .toString()
  );
}

const FixedPoint96 = {
  Q96: new BigNumber(2).pow(192), // Fixed-point multiplier in Solidity
};

// Helper function to simulate FullMath.mulDiv in Solidity
function mulDiv(a: BigNumber, b: BigNumber, denominator: BigNumber): BigNumber {
  return a.multipliedBy(b).dividedBy(denominator);
}

// Helper function to convert to uint128 in Solidity
function toUint128(num: BigNumber): BigNumber {
  if (num.isGreaterThan(new BigNumber(2).pow(128).minus(1))) {
    throw new Error('Number exceeds uint128 limit');
  }
  return num;
}

export function getLiquidityForAmount0(
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount0: BigNumber
): BigNumber {
  if (sqrtRatioAX96.isGreaterThan(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }
  const intermediate = mulDiv(sqrtRatioAX96, sqrtRatioBX96, FixedPoint96.Q96);
  return toUint128(mulDiv(amount0, intermediate, sqrtRatioBX96.minus(sqrtRatioAX96)));
}

export function getLiquidityForAmount1(
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount1: BigNumber
): BigNumber {
  if (sqrtRatioAX96.isGreaterThan(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }
  return toUint128(mulDiv(amount1, FixedPoint96.Q96, sqrtRatioBX96.minus(sqrtRatioAX96)));
}

export function getLiquidityForAmounts(
  sqrtRatioX96: BigNumber,
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount0: BigNumber,
  amount1: BigNumber
): BigNumber {
  if (sqrtRatioAX96.isGreaterThan(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }

  let liquidity: BigNumber;

  if (sqrtRatioX96.isLessThanOrEqualTo(sqrtRatioAX96)) {
    liquidity = getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (sqrtRatioX96.isLessThan(sqrtRatioBX96)) {
    const liquidity0 = getLiquidityForAmount0(sqrtRatioX96, sqrtRatioBX96, amount0);
    // const liquidity1 = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioX96, amount1);
    // liquidity = liquidity0.isLessThan(liquidity1) ? liquidity0 : liquidity1;
    liquidity = liquidity0;
  } else {
    liquidity = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }

  return liquidity;
}
