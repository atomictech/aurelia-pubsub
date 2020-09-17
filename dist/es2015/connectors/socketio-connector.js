"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocketIOConnector = exports.SocketIOConnectorCreator = void 0;

var _socket = _interopRequireDefault(require("socket.io-client"));

var _connector = require("./connector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SocketIOConnectorCreator {
  static create(config) {
    return new SocketIOConnector(_socket.default, config);
  }

}

exports.SocketIOConnectorCreator = SocketIOConnectorCreator;

class SocketIOConnector extends _connector.Connector {
  constructor(io) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    this.io = io;
    this.config = config;
    this.waitingMessages = [];
    this.isConnected = false;
    this.subscribeDestinations = {};
    this.initialize();
  }

  initialize() {
    this.client = new this.io(this.config.url, this.config.io);
    this.client.on('connect', this._connectionCallback.bind(this));
    this.client.on('disconnect', this._disconnectionCallback.bind(this));
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
      console.log('warning, IOConnector dropped waiting message, waiting buffer is full!');
    }

    this.waitingMessages.push(wrapper);
  }

  _clientCheck() {
    if (!this.client) {
      throw new Error('Cannot start io connector, no io client has been found.');
    }
  }

  start() {
    this._clientCheck();

    this.client.open();
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

      this.client.emit(destination, message, this._messageCallback.bind(this));
    }
  }

  subscribe(destination, callback) {
    this.client.on(destination, callback);

    if (!this.subscribeDestinations[destination]) {
      this.subscribeDestinations[destination] = [];
    }

    var id = "sub-".concat(destination, "-").concat(this.subscribeDestinations[destination].length);
    this.subscribeDestinations[destination].push({
      id,
      callback
    });
    return id;
  }

  unsubscribe(destination, subscriptionId) {
    if (!this.subscribeDestinations[destination]) {
      return;
    }

    this.subscribeDestinations[destination] = this.subscribeDestinations[destination].filter(subscription => {
      var filterValue = !subscriptionId || subscriptionId === subscription.id;

      if (filterValue) {
        this.client.off(destination, subscription.callback);
      }

      return !filterValue;
    });
  }

}

exports.SocketIOConnector = SocketIOConnector;