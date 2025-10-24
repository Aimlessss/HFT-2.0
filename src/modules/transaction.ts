import mongoose  from "mongoose";

const transactionSchema = new mongoose.Schema({
    values : {
        transactionId : String,
        totalStockNo : Number,
        totalAmount : Number
    },
    transactionDateTime : Date,
    stockName : {
        name : String, 
        symbol : String,
        exchangeType : String
    }
})

export const Transaction = mongoose.model('Transactions', transactionSchema);