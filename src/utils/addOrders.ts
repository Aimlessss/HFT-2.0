//utility to add orders to in-memory store
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Promise Rejection addOrders.ts', reason);
});
import logger from "../asserts/Log";
import { mockTrade } from "../tradeConfig";
import { AddOrder } from "./connectDb";

interface OrderRecord {
  orderId : string
  symbol: string;
  quantity: number;
  sl: number;
  type: string;
  time: string;
}

const orderStore: OrderRecord[] = [];

export function addOrder(order: OrderRecord) {
  if(mockTrade) return;
  orderStore.push(order);
  AddOrder.create(order).then(() => {
    logger.log(`Order for ${order.symbol} saved to database.`);
  }).catch(err => {
    logger.log(`Error saving order to database: ${err}`);
    console.error(err);
  });
}

export function getOrders() {
  return orderStore;
}

export function clearOrders() {
  orderStore.length = 0;
}
