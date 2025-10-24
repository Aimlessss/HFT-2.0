
import { Transaction } from './modules/transaction';
import connectDb from '/workspaces/javascript-node-mongo-2/src/utils/connectDb.ts'


async function run(){
  const newTransaction = new Transaction({
    values: {
      transactionId: 'TXN12345',
      totalStockNo: 100,
      totalAmount: 5000
    },
    transactionDateTime: new Date(),
    stockName: {
      name: 'Tech Corp',
      symbol: 'TC',
      exchangeType: 'NASDAQ'
    }
  });
  const savedTransaction = await newTransaction.save();
  console.log('Transaction saved:', savedTransaction);
}

await connectDb();
run();
