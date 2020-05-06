"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StompConnector = exports.StompConnectorCreator = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _stompjs = require("stompjs");

var _connector = require("./connector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class StompConnectorCreator {
  static create(config) {
    return new StompConnector(_stompjs.Stomp, config);
  }

}

exports.StompConnectorCreator = StompConnectorCreator;

class StompConnector extends _connector.Connector {
  constructor(stomp) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    this.stomp = stomp;
    this.config = config;
    this.waitingMessages = [];
    this.waitingSubscriptions = [];
    this.isConnected = false;
    this.localHeartbeat = null;
    this.subscribeDestinations = {};
    this.initialize();
  }

  initialize() {
    this.client = new this.stomp.client(this.config.endpoint);

    if (!this.config.debug) {
      this.client.debug = null;
    }

    if (_lodash.default.has(this.config, 'heartbeat')) {
      this.client.heartbeat.outgoing = _lodash.default.isUndefined(this.config.heartbeat.outgoing) ? 0 : parseInt(this.config.heartbeat.outgoing, 10);
      this.client.heartbeat.incoming = _lodash.default.isUndefined(this.config.heartbeat.incoming) ? 10000 : parseInt(this.config.heartbeat.incoming, 10);
    }

    if (this.config.autoConnect) {
      this.start();
    }
  }

  _connectionCallback() {
    this.isConnected = true;

    if (this.waitingSubscriptions.length) {
      this._doWaitingSubscriptions();
    }

    if (this.waitingMessages.length) {
      this._publishWaitingMessages();
    }
  }

  _disconnectionCallback() {
    this.isConnected = false;
    this.waitingMessages = [];
  }

  _errorCallback(err) {
    if (this.config.reconnectOnError) {
      this.initialize();
    }
  }

  _messageCallback() {}

  _publishWaitingMessages() {
    for (var wrapper of this.waitingMessages) {
      this.publish(this._forgeDestination(wrapper.destination, wrapper.toQueue), wrapper.message);
    }

    this.waitingMessages = [];
  }

  _doWaitingSubscriptions() {
    for (var wrapper of this.waitingSubscriptions) {
      this._clientSubscribe(wrapper.destination, wrapper.callback, wrapper.toQueue);
    }

    this.waitingSubscriptions = [];
  }

  _bufferMessage(wrapper) {
    if (this.config.maxWaitingMessages && this.waitingMessages.length > this.config.maxWaitingMessages) {
      this.waitingMessages.shift();
      console.log('warning, StompConnector dropped waiting message, waiting buffer is full!');
    }

    this.waitingMessages.push(wrapper);
  }

  _bufferSubscription(wrapper) {
    this.waitingSubscriptions.push(wrapper);
  }

  _clientCheck() {
    if (!this.client) {
      throw new Error('Cannot start stomp connector, no stomp client has been found.');
    }
  }

  _forgeDestination(destination) {
    var toQueue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var output = toQueue ? '/queue/' : '/topic/';

    if (this.config.prefix) {
      output += this.config.prefix + '/';
    }

    output += destination;
    return output;
  }

  start() {
    this._clientCheck();

    this.client.connect(this.config.login, this.config.password, this._connectionCallback.bind(this), this._errorCallback.bind(this), this.config.host);
  }

  stop() {
    this.subscribeDestinations = {};
    this.client.disconnect(this._disconnectionCallback.bind(this));
  }

  publish(destination, message) {
    var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var messageHeader = arguments.length > 3 ? arguments[3] : undefined;

    if (!this.isConnected) {
      var messageWrapper = {};
      messageWrapper.toQueue = toQueue;
      messageWrapper.destination = destination;
      messageWrapper.message = message;

      this._bufferMessage(messageWrapper);
    } else {
      this._clientCheck();

      this.client.send(this._forgeDestination(destination, toQueue), _lodash.default.merge({}, this.config.messageHeader, messageHeader), _lodash.default.isString(message) ? message : JSON.stringify(message));
    }
  }

  subscribe(destination, callback) {
    var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!this.isConnected) {
      var subscription = {
        destination,
        callback,
        toQueue
      };

      this._bufferSubscription(subscription);
    } else {
      this._clientSubscribe(destination, callback, toQueue);
    }
  }

  _clientSubscribe(destination, callback) {
    var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    this.subscribeDestinations[destination] = this.client.subscribe(this._forgeDestination(destination, toQueue), callback);
  }

  unsubscribe(destination) {
    this.subscribeDestinations[destination].unsubscribe();
  }

}

exports.StompConnector = StompConnector;