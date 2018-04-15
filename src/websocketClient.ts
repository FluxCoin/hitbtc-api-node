import { pipe, prop } from "ramda";
import * as WebSocket from "ws";

export type Listener = (data: IWebsocketData) => void;
export type EventListener = (...args: any[]) => void;
export type MessageListener = (event: IWebsocketMessageEvent) => void;

const withData = (listener: Listener): MessageListener =>
  pipe(prop("data"), (data: string) => JSON.parse(data), listener);

export interface IWebsocketParams {
  readonly key: string;
  readonly secret: string;
  readonly isDemo?: boolean;
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

export interface IWebsocketMessageEvent {
  readonly data: string;
  readonly type: string;
  readonly target: WebSocket;
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
  public socketUrl: string;
  public socket: WebSocket;
  private requestId: number;
  private hasCredentials: boolean;
  constructor({ key, secret, isDemo = false }: IWebsocketParams) {
    this.baseUrl = `${isDemo ? `demo-api` : `api`}.hitbtc.com`;
    this.socketUrl = `wss://${this.baseUrl}/api/2/ws`;
    this.hasCredentials = !!(key && secret);

    this.socket = new WebSocket(this.socketUrl);

    this.requestId = 0;

    if (this.hasCredentials) {
      this.addOnOpenListener(() => {
        this.sendRequest(`login`, {
          algo: `BASIC`,
          pKey: key,
          sKey: secret,
        });
      });
    }
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

  public addEventListener = (event: string, listener: EventListener) =>
    this.socket.addEventListener(event, listener)

  public removeEventListener = (event: string, listener: EventListener) =>
    this.socket.removeEventListener(event, listener)

  public addOnOpenListener = (listener: () => void) =>
    this.socket.addEventListener(`open`, listener)

  public removeOnOpenListener = (listener: () => void) =>
    this.socket.addEventListener(`open`, listener)
}
