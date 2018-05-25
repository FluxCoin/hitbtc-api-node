import { CandlePeriod, IOrder, IRESTParams, RESTMethod } from "./interfaces";
import WebsocketClient from "./websocketClient";
export default class HitBTC {
    static WebsocketClient: typeof WebsocketClient;
    key: any;
    secret: any;
    baseUrl: string;
    constructor({key, secret, isDemo, baseUrl}: IRESTParams);
    requestPublic: (endpoint: string, params?: {}) => Promise<any>;
    requestPrivate: (endpoint: string, params?: {}, method?: RESTMethod) => Promise<any>;
    currencies: () => Promise<any>;
    currency: (curr: string) => Promise<any>;
    symbols: () => Promise<any>;
    symbol: (sym: string) => Promise<any>;
    tickers: () => Promise<any>;
    ticker: (symbol: string) => Promise<any>;
    trades: (symbol: string, params: any) => Promise<any>;
    orderbook: (symbol: string, { limit }: {
        limit: number;
    }) => Promise<any>;
    candles: (symbol: string, { limit, period }: {
        limit: number;
        period: CandlePeriod;
    }) => Promise<any>;
    tradingBalance: () => Promise<any>;
    getOrders: () => Promise<IOrder[]>;
    getOrder: (clientOrderId: string) => Promise<IOrder>;
    newOrder: (params: any) => Promise<IOrder>;
    editOrder: (clientOrderId: string, params: any) => Promise<IOrder>;
    cancelOrders: (params: {
        symbol?: string | undefined;
    }) => Promise<IOrder[]>;
    cancelOrder: (clientOrderId: string) => Promise<IOrder>;
    fee: (symbol: string) => Promise<any>;
    orderHistory: (params: any) => Promise<any>;
    tradesHistory: (params: any) => Promise<any>;
    tradesByOrder: (orderId: string) => Promise<any>;
    accountBalance: () => Promise<any>;
    getCryptoAddress: (currency: string) => Promise<any>;
    newCryptoAddress: (currency: string) => Promise<any>;
    withdraw: (params: any) => Promise<any>;
    transfer: (params: {
        currency: string;
        amount: number;
        type: string;
    }) => Promise<any>;
    transactions: (params: any) => Promise<any>;
    transaction: (id: string, params: any) => Promise<any>;
}
