import { pipe, prop } from "ramda";
import * as ReconnectingWS from "reconnecting-websocket";
import ReconnectingWebsocket from "reconnecting-websocket";
import * as WS from "ws";

export type Listener = (data: IWebsocketData) => void;
export type EventListener = (...args: any[]) => void;
export type MessageListener = (event: MessageEvent) => void;

const withData = (listener: Listener): MessageListener =>
  pipe(prop("data"), (data: string) => JSON.parse(data), listener);

export interface IWebsocketParams {
  readonly key: string;
  readonly secret: string;
  readonly isDemo?: boolean;
  readonly baseUrl?: string;
}

export type IWebsocketData =
  | IBaseWebsocketData
  | IWebsocketBookData
  | IWebsocketTickerData;

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

export function isTickerMessage(
  data: IWebsocketData,
): data is IWebsocketTickerData {
  return data.method === "ticker";
}

export function isOrderbookMessage(
  data: IWebsocketData,
): data is IWebsocketBookData {
  return (
    data.method === "snapshotOrderbook" || data.method === "updateOrderbook"
  );
}

export default class HitBTCWebsocketClient {
  public baseUrl: string;
  public socket: ReconnectingWebsocket;
  private requestId: number;

  constructor({ key, secret, isDemo = false, baseUrl }: IWebsocketParams) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      const domain = `${isDemo ? `demo-api` : `api`}.hitbtc.com`;
      this.baseUrl = `wss://${domain}/api/2/ws`;
    }

    this.requestId = 0;

    const ReconnectingWebsocket: any = ReconnectingWS;
    this.socket = new ReconnectingWebsocket(this.baseUrl, undefined, {
      WebSocket: WS,
    });

    this.addOnOpenListener(() => {
      this.sendRequest(`login`, {
        algo: `BASIC`,
        pKey: key,
        sKey: secret,
      });
    });
  }

  public createRequest = (method: string, params = {}) => {
    const id = this.requestId;
    this.requestId += 1;
    return JSON.stringify({
      method,
      params,
      id,
    });
  }

  public sendRequest = (method: string, params: any) =>
    this.socket.send(this.createRequest(method, params))

  public addListener = (listener: Listener) =>
    this.socket.addEventListener(`message`, withData(listener))

  public removeListener = (listener: Listener) =>
    this.socket.removeEventListener(`message`, withData(listener))

  public addEventListener = (event: keyof WebSocketEventMap, listener: EventListener) =>
    this.socket.addEventListener(event, listener)

  public removeEventListener = (event: keyof WebSocketEventMap, listener: EventListener) =>
    this.socket.removeEventListener(event, listener)

  public addOnOpenListener = (listener: () => void) =>
    this.socket.addEventListener(`open`, listener)

  public removeOnOpenListener = (listener: () => void) =>
    this.socket.addEventListener(`open`, listener)
}
