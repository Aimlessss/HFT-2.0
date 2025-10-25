//utility to add orders to in-memory store

import logger from "../asserts/Log";
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
