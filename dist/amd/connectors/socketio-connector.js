function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

define(["exports", "socket.io-client", "./connector"], function (_exports, _socket, _connector) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SocketIOConnector = _exports.SocketIOConnectorCreator = void 0;
  _socket = _interopRequireDefault(_socket);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var SocketIOConnectorCreator = function () {
    function SocketIOConnectorCreator() {
      _classCallCheck(this, SocketIOConnectorCreator);
    }

    _createClass(SocketIOConnectorCreator, null, [{
      key: "create",
      value: function create(config) {
        return new SocketIOConnector(_socket.default, config);
      }
    }]);

    return SocketIOConnectorCreator;
  }();

  _exports.SocketIOConnectorCreator = SocketIOConnectorCreator;

  var SocketIOConnector = function (_Connector) {
    _inherits(SocketIOConnector, _Connector);

    var _super = _createSuper(SocketIOConnector);

    function SocketIOConnector(io) {
      var _this;

      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, SocketIOConnector);

      _this = _super.call(this);
      _this.io = io;
      _this.config = config;
      _this.waitingMessages = [];
      _this.isConnected = false;
      _this.subscribeDestinations = {};

      _this.initialize();

      return _this;
    }

    _createClass(SocketIOConnector, [{
      key: "initialize",
      value: function initialize() {
        this.client = new this.io(this.config.url, this.config.io);
        this.client.on('connect', this._connectionCallback.bind(this));
        this.client.on('disconnect', this._disconnectionCallback.bind(this));
      }
    }, {
      key: "_connectionCallback",
      value: function _connectionCallback() {
        this.isConnected = true;

        if (this.waitingMessages.length) {
          this._publishWaitingMessages();
        }
      }
    }, {
      key: "_disconnectionCallback",
      value: function _disconnectionCallback() {
        this.isConnected = false;
        this.waitingMessages = [];
      }
    }, {
      key: "_messageCallback",
      value: function _messageCallback() {}
    }, {
      key: "_publishWaitingMessages",
      value: function _publishWaitingMessages() {
        var _this2 = this;

        this.waitingMessages.forEach(function (wrapper) {
          _this2.publish(wrapper.destination, wrapper.message);
        });
      }
    }, {
      key: "_bufferMessage",
      value: function _bufferMessage(wrapper) {
        if (this.config.maxWaitingMessages && this.waitingMessages.length > this.config.maxWaitingMessages) {
          this.waitingMessages.shift();
          console.log('warning, IOConnector dropped waiting message, waiting buffer is full!');
        }

        this.waitingMessages.push(wrapper);
      }
    }, {
      key: "_clientCheck",
      value: function _clientCheck() {
        if (!this.client) {
          throw new Error('Cannot start io connector, no io client has been found.');
        }
      }
    }, {
      key: "start",
      value: function start() {
        this._clientCheck();

        this.client.open();
      }
    }, {
      key: "stop",
      value: function stop() {
        this.client.close();
      }
    }, {
      key: "publish",
      value: function publish(destination, message) {
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
    }, {
      key: "subscribe",
      value: function subscribe(destination, callback) {
        this.client.on(destination, callback);

        if (!this.subscribeDestinations[destination]) {
          this.subscribeDestinations[destination] = [];
        }

        var id = "sub-".concat(destination, "-").concat(this.subscribeDestinations[destination].length);
        this.subscribeDestinations[destination].push({
          id: id,
          callback: callback
        });
        return id;
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(destination, subscriptionId) {
        var _this3 = this;

        if (!this.subscribeDestinations[destination]) {
          return;
        }

        this.subscribeDestinations[destination] = this.subscribeDestinations[destination].filter(function (subscription) {
          var filterValue = !subscriptionId || subscriptionId === subscription.id;

          if (filterValue) {
            _this3.client.off(destination, subscription.callback);
          }

          return !filterValue;
        });
      }
    }]);

    return SocketIOConnector;
  }(_connector.Connector);

  _exports.SocketIOConnector = SocketIOConnector;
});