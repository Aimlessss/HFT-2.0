export let tradeConfig = [
  {
    symbol: "JPPOWER",
    quantity: 1,
    stopLoss: 1,
    immediateOrderAtMarketOpen: true,
    isOrdered: true,
    thresholdGap: 0.06,
    thresholdToSell: 1,
  },
];

export const mockTrade = true;

// ✅ Enforce rule
if (mockTrade) {
  const invalidConfigs = tradeConfig.filter(t => !t.immediateOrderAtMarketOpen);
  if (invalidConfigs.length > 0) {
    throw new Error(
      `❌ Invalid tradeConfig: mockTrade=true requires immediateOrderAtMarketOpen=true for all entries. 
      Affected symbols: ${invalidConfigs.map(t => t.symbol).join(", ")}`
    );
  }
}
