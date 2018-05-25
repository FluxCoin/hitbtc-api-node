export interface IRESTParams {
  key: string;
  secret: string;
  isDemo?: boolean;
  baseUrl?: string;
}

export type RESTMethod = "get" | "put" | "post" | "delete";

export type CandlePeriod =
  | "M1"
  | "M3"
  | "M5"
  | "M15"
  | "M30"
  | "H1"
  | "H4"
  | "D1"
  | "D7"
  | "1M";

export type Status =
  | "new"
  | "suspended"
  | "partiallyFilled"
  | "filled"
  | "canceled"
  | "expired";

export type TimeInForce = "GTC" | "FOK" | "IOC" | "Day" | "GTD";
export type Type = "limit" | "market" | "stopLimit" | "stopMarket";

export interface ITradesReport {
  fee: string;
  id: number;
  price: string;
  quantity: string;
  timestamp: string;
}

export interface IOrder {
  id: number;
  clientOrderId: string;
  symbol: string;
  side: "buy" | "sell";
  status: Status;
  type: Type;
  timeInForce: TimeInForce;
  quantity: string;
  price: string;
  cumQuantity: string;
  createdAt: string;
  updatedAt: string;
  tradesReport?: ITradesReport[];
}
