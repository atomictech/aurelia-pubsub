define(["exports", "lodash", "reconnecting-websocket", "./connector"], function (_exports, _lodash, _reconnectingWebsocket, _connector) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebsocketConnector = _exports.WebsocketConnectorCreator = void 0;
  _lodash = _interopRequireDefault(_lodash);
  _reconnectingWebsocket = _interopRequireDefault(_reconnectingWebsocket);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var WebsocketConnectorCreator = function () {
    function WebsocketConnectorCreator() {
      _classCallCheck(this, WebsocketConnectorCreator);
    }

    _createClass(WebsocketConnectorCreator, null, [{
      key: "create",
      value: function create(config) {
        return new WebsocketConnector(_reconnectingWebsocket.default, config);
      }
    }]);

    return WebsocketConnectorCreator;
  }();

  _exports.WebsocketConnectorCreator = WebsocketConnectorCreator;

  var WebsocketConnector = function (_Connector) {
    function WebsocketConnector(rws) {
      var _this;

      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, WebsocketConnector);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WebsocketConnector).call(this));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "waitingMessages", []);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isConnected", false);

      _this.rws = rws;
      _this.config = config;

      _this.initialize();

      return _this;
    }

    _createClass(WebsocketConnector, [{
      key: "initialize",
      value: function initialize() {
        this.client = new this.rws(this.config.endpoint);
        this.client.addEventListener('open', this._connectionCallback.bind(this));
        this.client.addEventListener('close', this._disconnectionCallback.bind(this));
        this.client.addEventListener('message', this._messageCallback.bind(this));
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
          console.log('warning, WSConnector dropped waiting message, waiting buffer is full!');
        }

        this.waitingMessages.push(wrapper);
      }
    }, {
      key: "_clientCheck",
      value: function _clientCheck() {
        if (!this.client) {
          throw new Error('Cannot start ws connector, no ws client has been found.');
        }
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

          this.client.send(_lodash.default.isString(message) ? message : JSON.stringify(message));
        }
      }
    }]);

    _inherits(WebsocketConnector, _Connector);

    return WebsocketConnector;
  }(_connector.Connector);

  _exports.WebsocketConnector = WebsocketConnector;
});