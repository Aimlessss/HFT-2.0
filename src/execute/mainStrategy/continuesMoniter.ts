process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Promise Rejection:', reason);
});
import { Exchanges, PortfolioHolding, Product } from "kiteconnect";
import { MarketTime } from "./marketTimings/marketTimings.ts";
import logger from "../../asserts/Log.ts";
import { kiteConnectMain } from "../../utils/kiteSdk.ts";
import { mockTrade } from "../../tradeConfig.ts";
import { placeOrder } from "./placeOrder.ts";

type TempConfig = {
  symbol: string;
  quantity: number;
  thresholdToSell?: number;
  isOrdered?: boolean;
};

type holdings = Array<{
  tradingsymbol: string;
  exchange: Exchanges;
  pnl: number;
}>;

let liveHoldings: holdings = [];

export function getLiveHoldings() {
  return liveHoldings;
}


export async function tickAllSymbols(configs: TempConfig[], access_token : string) : Promise<holdings> {
  try {
    while (MarketTime.isMarketOpen() && !mockTrade) { 
      logger.log(`⏱️ Ticking...`);

      let holdingsData: PortfolioHolding[] = [];
      try {
        holdingsData = await kiteConnectMain.getHoldings();
      } catch (err) {
        logger.log(`Error fetching holdings: ${err}`);
        continue;
      }

      liveHoldings = holdingsData.map(h => ({
        tradingsymbol: h.tradingsymbol,
        exchange: h.exchange as Exchanges,
        pnl: h.pnl,
      }));

      for (const config of configs) {
        let holdings: PortfolioHolding[];
        try {
          holdings = await kiteConnectMain.getHoldings();
        } catch (err) {
          logger.log(`Error fetching holdings: ${err}`);
          continue; // skip this tick if API fails
        }

        const holding = holdings.find(h => h.tradingsymbol === config.symbol);
        if (!holding) {
          logger.log(`⚠️ Holding not found for ${config.symbol}`);
          continue;
        }

        const currentPnL = holding.pnl;
        const threshold = config.thresholdToSell ?? Infinity;

        if (currentPnL >= threshold) {
          logger.log(`✅ ${config.symbol} reached threshold PnL: ₹${currentPnL}. Selling...`);
          try {
            const sellOrder = await placeOrder(holding.tradingsymbol, 'SELL', config.quantity, 0);
            logger.log(`🚀 SELL Order Placed for ${config.symbol}. Order ID: ${sellOrder!.order_id}`);
            break; // exit for-loop after sell
          } catch (err) {
            logger.log(`❌ Failed to place order for ${config.symbol}: ${err}`);
          }
        } else {
          logger.log(`🔍 ${config.symbol} PnL ₹${currentPnL} < ₹${threshold} — Not selling yet.`);
        }
      }

      await new Promise(res => setTimeout(res, 60000));
      logger.log(`tick tok, tick tok`);
    }
    kiteConnectMain.setAccessToken(access_token);
    const finalHoldings = await kiteConnectMain.getHoldings();

    const result: holdings = finalHoldings.map(h => ({
      tradingsymbol: h.tradingsymbol,
      exchange: h.exchange as Exchanges,
      pnl: h.pnl
    }));

    logger.log(`Final Holdings: ${JSON.stringify(result, null, 2)}`);

    return result;
  } catch (error) {
    logger.log(`Unhandled error in tickAllSymbols: ${error}`);
    throw error; // propagate to caller safely
  }
}
