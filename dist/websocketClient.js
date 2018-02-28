'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _get = require('lodash/fp/get');

var _get2 = _interopRequireDefault(_get);

var _pipe = require('lodash/fp/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const withData = listener => (0, _pipe2.default)((0, _get2.default)(`data`), dataString => JSON.parse(dataString), listener);

class HitBTCWebsocketClient {
  constructor({ key, secret, isDemo = false }) {
    this.createRequest = (method, params = {}) => {
      const id = this.requestId;
      this.requestId += 1;
      return JSON.stringify({
        method,
        params,
        id
      });
    };

    this.sendRequest = (method, params) => this.socket.send(this.createRequest(method, params));

    this.addListener = listener => this.socket.addEventListener(`message`, withData(listener));

    this.removeListener = listener => this.socket.removeEventListener(`message`, withData(listener));

    this.addEventListener = (event, listener) => this.socket.addEventListener(event, listener);

    this.removeEventListener = (event, listener) => this.socket.removeEventListener(event, listener);

    this.addOnOpenListener = listener => this.socket.addEventListener(`open`, listener);

    this.removeOnOpenListener = listener => this.socket.addEventListener(`open`, listener);

    this.baseUrl = `${isDemo ? `demo-api` : `api`}.hitbtc.com`;
    this.socketUrl = `ws://${this.baseUrl}/api/2/ws`;
    this.hasCredentials = key && secret;

    this.socket = new _ws2.default(this.socketUrl);

    this.requestId = 0;

    if (this.hasCredentials) {
      this.addOnOpenListener(() => {
        this.sendRequest(`login`, {
          algo: `BASIC`,
          pKey: key,
          sKey: secret
        });
      });
    }
  }

}
exports.default = HitBTCWebsocketClient;