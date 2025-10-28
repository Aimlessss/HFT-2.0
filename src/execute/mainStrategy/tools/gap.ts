import logger from "../../../asserts/Log.ts";
import { placeOrder } from "../placeOrder.ts";
import { checkEquity } from "./checkEquity.ts";
const BUY = "BUY";
const SELL = "SELL";

export function gapCalcPrct(openPrice: number, lastClosingPrice: any): number {
    const gap = openPrice - lastClosingPrice;
    const gapPercent = (gap / lastClosingPrice) * 100;
    logger.log(`🔍 Gap %: ${gapPercent.toFixed(2)}%`);
    return gapPercent;
}

export async function placeOrderStat(gapPercent : number, symbol : string, quantity : number, sl : number, thresholdGap : number, access_token : string) : Promise< number | undefined> {
    let order;
    if (gapPercent >= thresholdGap) {
        logger.log(`🚀 GAP-UP detected (> ${thresholdGap}%) — Consider BUY`);
        placeOrder(symbol, BUY, quantity, sl, access_token);
    } else if (gapPercent <= -thresholdGap) {
        logger.log(`🔻 GAP-DOWN detected (< -${thresholdGap}%) — Consider SELL`);
        if(await checkEquity(symbol, quantity)) placeOrder(symbol, SELL, quantity, sl, access_token);
    } else {
        //do nothing 
        logger.log(`No gap detected`)
        order = undefined;
    }
    return order;
}  
