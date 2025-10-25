import { Exchanges, OrderType, Product } from "kiteconnect";
import logger from "../../asserts/Log";
import { confirmationOfBalnce } from "./confirmationOfFunds";
import { addOrder } from "../../utils/addOrders";
import { getTokens, kiteConnectMain } from "../../utils/kiteSdk";
import { mockTrade } from "../../tradeConfig";
import { io } from '../execute'

export async function placeOrder(symbol : string ,type: "BUY" | "SELL", quantity : number, sl : number, token : string) {

    const params = {
        exchange : 'NSE' as Exchanges,
        tradingsymbol : symbol,
        transaction_type : type,
        order_type : "MARKET" as OrderType,
        quantity: quantity, // Add quantity with a default value
        product: (process.env.PRODUCT as Product) || "MIS", // Add product with a default value
        stoploss : sl,
    }
    
    if(!confirmationOfBalnce(params.tradingsymbol, params.quantity, token, mockTrade) ){
        console.log("Insufficient funds for the order.");
        return;
    }

    logger.log(`Placing ${type} order for ${params.quantity} shares of ${params.tradingsymbol} at market price.`);
    const { access_token } = getTokens();
    kiteConnectMain.setAccessToken(access_token);
    
    let order;
    if(mockTrade){
        logger.log(`Mock trade enabled. Simulating order placement for ${params.tradingsymbol}.`);
        order = {
            order_id: "MOCK_ORDER_12345"
        };
    }else{
        order = await kiteConnectMain.placeOrder("regular", params);
    }

    if(order.order_id && order){
        const orderData = {
            orderId : order.order_id,
            symbol: params.tradingsymbol,
            quantity: params.quantity,
            sl: params.stoploss,
            type: type,
            time: new Date().toISOString()
        }
        addOrder(orderData);
        io.emit("newOrder", orderData)
    }
    
    return order;
} 