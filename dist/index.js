"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const qs_1 = require("qs");
const ramda_1 = require("ramda");
const websocketClient_1 = require("./websocketClient");
class HitBTC {
    constructor({ key, secret, isDemo = false, baseUrl }) {
        this.requestPublic = (endpoint, params = {}) => axios_1.default
            .get(`${this.baseUrl}/public${endpoint}`, { params })
            .then(ramda_1.prop(`data`))
            .catch(err => {
            throw ramda_1.path(["response", "data"], err);
        });
        this.requestPrivate = (endpoint, params = {}, method = `post`) => {
            if (!this.key || !this.secret) {
                throw new Error(`API key and secret key required to use authenticated methods`);
            }
            const config = {
                auth: {
                    username: this.key,
                    password: this.secret,
                },
                params,
            };
            const url = `${this.baseUrl}${endpoint}`;
            const result = method === "get" || method === "delete"
                ? axios_1.default[method](url, config)
                : axios_1.default[method](url, qs_1.stringify(params), config);
            return result.then(ramda_1.prop(`data`)).catch(err => {
                throw ramda_1.path(["response", "data"], err);
            });
        };
        this.currencies = () => this.requestPublic(`/currency`);
        this.currency = (curr) => this.requestPublic(`/currency/${curr}`);
        this.symbols = () => this.requestPublic(`/symbol`);
        this.symbol = (sym) => this.requestPublic(`/symbol/${sym}`);
        this.tickers = () => this.requestPublic(`/ticker`);
        this.ticker = (symbol) => this.requestPublic(`/ticker/${symbol}`);
        this.trades = (symbol, params) => this.requestPublic(`/trades/${symbol}`, params);
        this.orderbook = (symbol, { limit }) => this.requestPublic(`/orderbook/${symbol}`, { limit });
        this.candles = (symbol, { limit, period }) => this.requestPublic(`/candles/${symbol}`, { limit, period });
        this.tradingBalance = () => this.requestPrivate(`/trading/balance`, {}, `get`);
        this.getOrders = () => this.requestPrivate(`/order`, {}, `get`);
        this.getOrder = (clientOrderId) => this.requestPrivate(`/order/${clientOrderId}`, {}, `get`);
        this.newOrder = (params) => this.requestPrivate(`/order`, params);
        this.editOrder = (clientOrderId, params) => this.requestPrivate(`/order/${clientOrderId}`, params, `put`);
        this.cancelOrders = (params) => this.requestPrivate(`/order`, params, `delete`);
        this.cancelOrder = (clientOrderId) => this.requestPrivate(`/order/${clientOrderId}`, {}, `delete`);
        this.fee = (symbol) => this.requestPrivate(`/trading/fee/${symbol}`, {}, `get`);
        this.orderHistory = (params) => this.requestPrivate(`/history/order`, params, `get`);
        this.tradesHistory = (params) => this.requestPrivate(`/history/trades`, params, `get`);
        this.tradesByOrder = (orderId) => this.requestPrivate(`/history/order/${orderId}/trades`, {}, `get`);
        this.accountBalance = () => this.requestPrivate(`/account/balance`, {}, `get`);
        this.getCryptoAddress = (currency) => this.requestPrivate(`/account/crypto/address/${currency}`, {}, `get`);
        this.newCryptoAddress = (currency) => this.requestPrivate(`/account/crypto/address/${currency}`);
        this.withdraw = (params) => this.requestPrivate(`/account/crypto/withdraw`, params);
        this.transfer = (params) => this.requestPrivate(`/account/transfer`, params);
        this.transactions = (params) => this.requestPrivate(`/account/transactions`, params, `get`);
        this.transaction = (id, params) => this.requestPrivate(`/account/transactions/${id}`, params, `get`);
        this.key = key;
        this.secret = secret;
        if (baseUrl) {
            this.baseUrl = baseUrl;
        }
        else {
            const subdomain = isDemo ? `demo-api` : `api`;
            this.baseUrl = `https://${subdomain}.hitbtc.com/api/v2`;
        }
    }
}
HitBTC.WebsocketClient = websocketClient_1.default;
exports.default = HitBTC;
//# sourceMappingURL=index.js.map