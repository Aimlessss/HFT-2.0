3000 npx tsx src/execute/execute.ts
5000 npx tsx src/server.ts

curl https://api.kite.trade/orders/regular \
    -H "X-Kite-Version: 3" \
    -H "Authorization: token api_zdt8z712ll6gk5e1key:WCd1om64rxBCMuJYGgflYTlaWgPpIn3l" \
    -d "tradingsymbol=JPPOWER" \
    -d "exchange=NSE" \
    -d "transaction_type=BUY" \
    -d "order_type=MARKET" \
    -d "quantity=1" \
    -d "product=MIS" \
    -d "validity=DAY"