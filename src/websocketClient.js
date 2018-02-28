import WebSocket from 'ws';
import get from 'lodash/fp/get';
import pipe from 'lodash/fp/pipe';

const withData = listener => pipe(
  get(`data`),
  dataString => JSON.parse(dataString),
  listener,
);

export default class HitBTCWebsocketClient {
  constructor({ key, secret, isDemo = false }) {
    this.baseUrl = `${isDemo ? `demo-api` : `api`}.hitbtc.com`;
    this.socketUrl = `ws://${this.baseUrl}/api/2/ws`;
    this.hasCredentials = key && secret;

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

  createRequest = (method, params = {}) => {
    const id = this.requestId;
    this.requestId += 1;
    return JSON.stringify({
      method,
      params,
      id,
    });
  }

  sendRequest = (method, params) =>
    this.socket.send(this.createRequest(method, params));

  addListener = listener =>
    this.socket.addEventListener(`message`, withData(listener));

  removeListener = listener =>
    this.socket.removeEventListener(`message`, withData(listener));

  addEventListener = (event, listener) =>
    this.socket.addEventListener(event, listener);

  removeEventListener = (event, listener) =>
    this.socket.removeEventListener(event, listener);

  addOnOpenListener = listener =>
    this.socket.addEventListener(`open`, listener);

  removeOnOpenListener = listener =>
    this.socket.addEventListener(`open`, listener);

}
