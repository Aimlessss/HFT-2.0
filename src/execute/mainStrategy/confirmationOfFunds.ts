
import {  kiteConnectMain } from "../../utils/kiteSdk";
import { getPrice } from "./tools/closingCandle";


export async function confirmationOfBalnce(stock : string, quantity : number, token : string, mockTrade? : Boolean) {
    kiteConnectMain.setAccessToken(token);
    const funds = await kiteConnectMain.getMargins();
    const availableFunds = Number(funds.equity!.net) ;
    // get the price of the stock 
    const price = await getPrice(stock);
    const requiredFunds = Number(price) * quantity;
    if (availableFunds >= requiredFunds) {
        console.log("Funds are available for the order.");
        return true;
    } else {
        console.log("Insufficient funds for the order.");
        return false;
    }
}