import { Exchanges, PortfolioHolding, Product } from "kiteconnect";
import { MarketTime } from "./marketTimings/marketTimings.ts";
import logger from "../../asserts/Log.ts";
import { kiteConnectMain } from "../../utils/kiteSdk.ts";

type TempConfig = {
  symbol: string;
  quantity: number;
  thresholdToSell?: number;
  isOrdered?: boolean;
};


export async function tickAllSymbols(configs: TempConfig[]) : Promise<Array<PortfolioHolding>> {


  while (MarketTime.isMarketOpen()) {
    logger.log(`⏱️ Ticking...`);

    for (const config of configs) {
      const holdings = await kiteConnectMain.getHoldings();
      const holding = holdings.find(h => h.tradingsymbol === config.symbol);

      if (!holding) {
        logger.log(`⚠️ Holding not found for ${config.symbol}`);
        continue;
      }

      const currentPnL = holding.pnl;
      const threshold = config.thresholdToSell ?? Infinity;

      if (currentPnL >= threshold) {
        logger.log(`✅ ${config.symbol} reached threshold PnL: ₹${currentPnL}. Selling...`);

        const sellOrder = await kiteConnectMain.placeOrder("regular", {
          exchange: holding.exchange as Exchanges,
          tradingsymbol: holding.tradingsymbol,
          transaction_type: "SELL",
          quantity: config.quantity,
          product: holding.product as Product,
          order_type: "MARKET",
        });

        logger.log(`🚀 SELL Order Placed for ${config.symbol}. Order ID: ${sellOrder.order_id}`);
        break; // Exit the loop after a successful sell
      } else {
        logger.log(`🔍 ${config.symbol} PnL ₹${currentPnL} < ₹${threshold} — Not selling yet.`);
      }
    }

    await new Promise(res => setTimeout(res, 60000));
    logger.log(`tick tok, tick tok`)
  }
  return Promise.resolve(await kiteConnectMain.getHoldings());
}

// await tickAllSymbols(tradeConfig,'yTAytirTw4vDebX76NLg24SFxwExFOGP')