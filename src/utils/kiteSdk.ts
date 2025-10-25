import { Connect, Exchanges, KiteConnect, OrderType, Product } from 'kiteconnect';
import logger from '../asserts/Log';
const apiKey = 'vnt1pnm7wq88fs23';
const apiSecret = 'l64392o2wecicak5xa3lf1fzl69exr0d';
export const kiteConnectMain = new KiteConnect({ api_key: apiKey });

let tokens = {
  request_token: '',
  access_token: ''
};

export function setTokens(request: string, access: string) {
  tokens.request_token = request;
  tokens.access_token = access;
}

export function getTokens() {
  return tokens;
}

export async function init(request_token: string) : Promise<string> {

    logger.log('Initializing Kite SDK with request token: ' + request_token);
    const requestToken = request_token;
    const accessToken = await generateSession(kiteConnectMain, requestToken, apiSecret);
    logger.log('Kite SDK initialization process completed.');
    return Promise.resolve(accessToken);
}

async function generateSession(kiteConnectMain: Connect, requestToken: string, apiSecret: string) : Promise<string>{
    try {
        const response = await kiteConnectMain.generateSession(requestToken, apiSecret);
        kiteConnectMain.setAccessToken(response.access_token);
        
        setTokens(requestToken, response.access_token);
        logger.log('Kite SDK initialized successfully: ' + JSON.stringify(response));
        return Promise.resolve(response.access_token);
    } catch (error) {

        logger.log('Error initializing Kite SDK: ' + error);
        return Promise.reject(error);
        
    }
}
