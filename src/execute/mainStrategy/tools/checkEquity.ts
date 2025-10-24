import logger from "../../../asserts/Log";
import { kiteConnectMain } from "../../../utils/kiteSdk";


export async function checkEquity(symbol: string, quantity: number): Promise<boolean> {
  const holdings = await kiteConnectMain.getHoldings();

  // a.assertDefined(holdings, 'no holdings');
  logger.log(`Checking if User holds the share before selling - start`);
  const tradingsymbol = holdings[0].tradingsymbol;
  const quantityBrought = holdings[0].quantity;
  logger.log(`Checking if User holds the share before selling - done`);
  if (tradingsymbol == symbol && quantityBrought >= quantity) {
    return true;
  } else {
    return false;
  }

}
