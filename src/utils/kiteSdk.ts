import { Connect, KiteConnect } from 'kiteconnect';
import logger from '../asserts/Log';
const apiKey = 'zdt8z712ll6gk5e1';
const apiSecret = 'ylvvp4hhaj3ccs3m4tzk259srbw4rxiz';
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
        const profile = await kiteConnectMain.getProfile();
        console.log('Kite Profile:', profile);
        setTokens(requestToken, response.access_token);
        logger.log('Kite SDK initialized successfully: ' + JSON.stringify(response));
        return Promise.resolve(response.access_token);
    } catch (error) {

        logger.log('Error initializing Kite SDK: ' + error);
        return Promise.reject(error);
        
    }
}
