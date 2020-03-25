"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebsocketConnector = exports.WebsocketConnectorCreator = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _reconnectingWebsocket = _interopRequireDefault(require("reconnecting-websocket"));

var _connector = require("./connector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WebsocketConnectorCreator {
  static create(config) {
    return new WebsocketConnector(_reconnectingWebsocket.default, config);
  }

}

exports.WebsocketConnectorCreator = WebsocketConnectorCreator;

class WebsocketConnector extends _connector.Connector {
  constructor(rws) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();

    _defineProperty(this, "waitingMessages", []);

    _defineProperty(this, "isConnected", false);

    this.rws = rws;
    this.config = config;
    this.initialize();
  }

  initialize() {
    this.client = new this.rws(this.config.endpoint);
    this.client.addEventListener('open', this._connectionCallback.bind(this));
    this.client.addEventListener('close', this._disconnectionCallback.bind(this));
    this.client.addEventListener('message', this._messageCallback.bind(this));
  }

  _connectionCallback() {
    this.isConnected = true;

    if (this.waitingMessages.length) {
      this._publishWaitingMessages();
    }
  }

  _disconnectionCallback() {
    this.isConnected = false;
    this.waitingMessages = [];
  }

  _messageCallback() {}

  _publishWaitingMessages() {
    this.waitingMessages.forEach(wrapper => {
      this.publish(wrapper.destination, wrapper.message);
    });
  }

  _bufferMessage(wrapper) {
    if (this.config.maxWaitingMessages && this.waitingMessages.length > this.config.maxWaitingMessages) {
      this.waitingMessages.shift();
      console.log('warning, WSConnector dropped waiting message, waiting buffer is full!');
    }

    this.waitingMessages.push(wrapper);
  }

  _clientCheck() {
    if (!this.client) {
      throw new Error('Cannot start ws connector, no ws client has been found.');
    }
  }

  stop() {
    this.client.close();
  }

  publish(destination, message) {
    if (!this.isConnected) {
      var messageWrapper = {
        destination: destination,
        message: message
      };

      this._bufferMessage(messageWrapper);
    } else {
      this._clientCheck();

      this.client.send(_lodash.default.isString(message) ? message : JSON.stringify(message));
    }
  }

}

exports.WebsocketConnector = WebsocketConnector;