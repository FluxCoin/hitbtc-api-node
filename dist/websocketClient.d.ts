import ReconnectingWebsocket from "reconnecting-websocket";
export declare type Listener = (data: IWebsocketData) => void;
export declare type EventListener = (...args: any[]) => void;
export declare type MessageListener = (event: MessageEvent) => void;
export interface IWebsocketParams {
    readonly key: string;
    readonly secret: string;
    readonly isDemo?: boolean;
    readonly baseUrl?: string;
}
export declare type IWebsocketData = IBaseWebsocketData | IWebsocketBookData | IWebsocketTickerData;
export interface IBaseWebsocketData {
    readonly jsonrpc: string;
    readonly method?: string;
    readonly params?: any;
    readonly result?: any;
    readonly error?: any;
    readonly id?: number;
}
export interface IWebsocketBookData extends IBaseWebsocketData {
    readonly method: "snapshotOrderbook" | "updateOrderbook";
    readonly params: IWebsocketBookParams;
    readonly error: never;
    readonly result: never;
    readonly id: never;
}
export interface IWebsocketBookItem {
    readonly price: string;
    readonly size: string;
}
export interface IWebsocketBookParams {
    readonly ask: IWebsocketBookItem[];
    readonly bid: IWebsocketBookItem[];
    readonly sequence: number;
    readonly symbol: string;
}
export interface IWebsocketTickerData extends IBaseWebsocketData {
    readonly method: "ticker";
    readonly params: ITickerParams;
    readonly error: never;
    readonly result: never;
    readonly id: never;
}
export interface ITickerParams {
    readonly ask: string;
    readonly bid: string;
    readonly last: string;
    readonly open: string;
    readonly low: string;
    readonly high: string;
    readonly volume: string;
    readonly volumeQuote: string;
    readonly timestamp: string;
    readonly symbol: string;
}
export declare function isTickerMessage(data: IWebsocketData): data is IWebsocketTickerData;
export declare function isOrderbookMessage(data: IWebsocketData): data is IWebsocketBookData;
export default class HitBTCWebsocketClient {
    baseUrl: string;
    socket: ReconnectingWebsocket;
    private requestId;
    constructor({ key, secret, isDemo, baseUrl }: IWebsocketParams);
    createRequest: (method: string, params?: {}) => string;
    sendRequest: (method: string, params: any) => void;
    addListener: (listener: Listener) => void;
    removeListener: (listener: Listener) => void;
    addEventListener: (event: "error" | "message" | "close" | "open", listener: EventListener) => void;
    removeEventListener: (event: "error" | "message" | "close" | "open", listener: EventListener) => void;
    addOnOpenListener: (listener: () => void) => void;
    removeOnOpenListener: (listener: () => void) => void;
}
