import { NseIndia } from "stock-nse-india";
import logger from "../../../asserts/Log";

const nse = new NseIndia();

export async function lastClosing(symbol: string, isMonday?: boolean) {
    const today = new Date();
    let dateRange;

    if (isMonday) {
        // On Monday, fetch last Friday's price
        const friday = new Date();
        friday.setDate(today.getDate() - 3); // Go back to last Friday

        logger.log(`It's Monday - fetching price for last Friday (${friday.toDateString()})`);

        dateRange = {
            start: friday,
            end: friday
        };
    } else {
        // Fetch yesterday's price
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 2);

        logger.log(`Fetching price of ${symbol} for yesterday (${yesterday.toDateString()})`);

        dateRange = {
            start: yesterday,   
            end: yesterday
        };
    }

    const historicalData = await nse.getEquityHistoricalData(symbol, dateRange);
    const lastClosingPrice = historicalData?.[0]?.data?.[0]?.CH_LAST_TRADED_PRICE;

    // a.assertDefined(lastClosingPrice, 'lastClosingPrice is undefined');

    logger.log(`Last price fetched for ${symbol}: ${lastClosingPrice}`);
    return lastClosingPrice;
}

export async function getPrice(symbol : string){
    const stock = await nse.getEquityDetails(symbol);
    //maybe close or open ??
    const price = Math.max(stock.priceInfo.close, stock.priceInfo.open)
    return price;
}