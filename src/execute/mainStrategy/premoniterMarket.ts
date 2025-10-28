import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { MarketTime } from './marketTimings/marketTimings';
import logger from '../../asserts/Log';
import { strategyCron } from './strategyCron'
import { mockTrade, tradeConfig } from '../../tradeConfig';
import { tickAllSymbols } from './continuesMoniter';
import { placeOrder} from '../mainStrategy/placeOrder'
import { kiteConnectMain } from '../../utils/kiteSdk';

register('ts-node/esm', pathToFileURL('./'));


export async function preMoniter(access_token : string | undefined) {
  try {
    if (MarketTime.isMarketOpen() || mockTrade === true) {
      logger.log(`Markets are open here we fucking go!!!!`);
      const tempConfig = [];

      for (let i = 0; i < tradeConfig.length; i++) {
        const { symbol, quantity, stopLoss: sl, immediateOrderAtMarketOpen, thresholdToSell, thresholdGap } = tradeConfig[i];

        if (immediateOrderAtMarketOpen) {
          logger.log(`immediate Order - start`);
          const order = await placeOrder(symbol, "BUY", quantity, sl, access_token!);

          if (order !== undefined) {
            logger.log(`immediate Order for ${symbol} with quantity ${quantity} & stop loss of ${sl} has been placed on NSE`);
            logger.log(`immediate Order - done`);
            tradeConfig[i].isOrdered = true;
            tempConfig.push({ symbol, quantity, thresholdToSell });
          } else {
            tradeConfig[i].isOrdered = false;
          }

        } else {
          const startOrder = await strategyCron(symbol, quantity, sl, thresholdGap, access_token!);

          if (startOrder !== undefined) {
            tradeConfig[i].isOrdered = true;
            tempConfig.push({ symbol, quantity, thresholdToSell });
          } else {
            tradeConfig[i].isOrdered = false;
          }
        }
      }

      logger.log(`going in continues moniter now`);
      await tickAllSymbols(tempConfig, access_token!);
    } else {
      const timeLeft = MarketTime.msUntilNextMarketOpen();
      logger.log(`Market closed. Waiting for ${timeLeft / 1000} seconds...`);
      setTimeout(() => {
        preMoniter(access_token);
      }, timeLeft);
      return { status: "closed", message: `Market closed. Will retry in ${Math.ceil(timeLeft / 1000)} seconds.` };
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
    logger.log(`💥 Unhandled error in preMoniter: ${errorMessage}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default preMoniter;