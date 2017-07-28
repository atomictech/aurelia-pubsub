'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocketIOConnector = exports.SocketIOConnectorCreator = undefined;

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _connector = require('./connector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketIOConnectorCreator = exports.SocketIOConnectorCreator = function () {
  function SocketIOConnectorCreator() {
    _classCallCheck(this, SocketIOConnectorCreator);
  }

  SocketIOConnectorCreator.create = function create(config) {
    return new SocketIOConnector(_socket2.default, config);
  };

  return SocketIOConnectorCreator;
}();

var SocketIOConnector = exports.SocketIOConnector = function (_Connector) {
  _inherits(SocketIOConnector, _Connector);

  function SocketIOConnector(io) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, SocketIOConnector);

    var _this = _possibleConstructorReturn(this, _Connector.call(this));

    _this.io = io;
    _this.config = config;

    _this.waitingMessages = [];
    _this.isConnected = false;
    _this.subscribeDestinations = {};

    _this.initialize();
    return _this;
  }

  SocketIOConnector.prototype.initialize = function initialize() {
    this.client = new this.io(this.config.url, this.config.io);

    this.client.on('connect', this._connectionCallback.bind(this));
    this.client.on('disconnect', this._disconnectionCallback.bind(this));
  };

  SocketIOConnector.prototype._connectionCallback = function _connectionCallback() {
    this.isConnected = true;

    if (this.waitingMessages.length) {
      this._publishWaitingMessages();
    }
  };

  SocketIOConnector.prototype._disconnectionCallback = function _disconnectionCallback() {
    this.isConnected = false;
    this.waitingMessages = [];
  };

  SocketIOConnector.prototype._messageCallback = function _messageCallback() {};

  SocketIOConnector.prototype._publishWaitingMessages = function _publishWaitingMessages() {
    var _this2 = this;

    this.waitingMessages.forEach(function (wrapper) {
      _this2.publish(wrapper.destination, wrapper.message);
    });
  };

  SocketIOConnector.prototype._bufferMessage = function _bufferMessage(wrapper) {
    if (this.config.maxWaitingMessages && this.waitingMessages.length > this.config.maxWaitingMessages) {
      this.waitingMessages.shift();
      console.log('warning, IOConnector dropped waiting message, waiting buffer is full!');
    }
    this.waitingMessages.push(wrapper);
  };

  SocketIOConnector.prototype._clientCheck = function _clientCheck() {
    if (!this.client) {
      throw new Error('Cannot start io connector, no io client has been found.');
    }
  };

  SocketIOConnector.prototype.start = function start() {
    this._clientCheck();
    this.client.open();
  };

  SocketIOConnector.prototype.stop = function stop() {
    this.client.close();
  };

  SocketIOConnector.prototype.publish = function publish(destination, message) {
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
  };

  SocketIOConnector.prototype.subscribe = function subscribe(destination, callback) {
    this.subscribeDestinations[destination] = callback;
    this.client.on(destination, callback);
  };

  SocketIOConnector.prototype.unsubscribe = function unsubscribe(destination) {
    delete this.subscribeDestinations[destination];
    this.client.off(destination);
  };

  return SocketIOConnector;
}(_connector.Connector);