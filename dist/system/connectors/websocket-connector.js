"use strict";

System.register(["lodash", "reconnecting-websocket", "./connector"], function (_export, _context) {
  "use strict";

  var _, ReconnectingWebSocket, Connector, WebsocketConnectorCreator, WebsocketConnector;

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_reconnectingWebsocket) {
      ReconnectingWebSocket = _reconnectingWebsocket.default;
    }, function (_connector) {
      Connector = _connector.Connector;
    }],
    execute: function () {
      _export("WebsocketConnectorCreator", WebsocketConnectorCreator = function () {
        function WebsocketConnectorCreator() {
          _classCallCheck(this, WebsocketConnectorCreator);
        }

        _createClass(WebsocketConnectorCreator, null, [{
          key: "create",
          value: function create(config) {
            return new WebsocketConnector(ReconnectingWebSocket, config);
          }
        }]);

        return WebsocketConnectorCreator;
      }());

      _export("WebsocketConnector", WebsocketConnector = function (_Connector) {
        _inherits(WebsocketConnector, _Connector);

        var _super = _createSuper(WebsocketConnector);

        function WebsocketConnector(rws) {
          var _this;

          var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          _classCallCheck(this, WebsocketConnector);

          _this = _super.call(this);

          _defineProperty(_assertThisInitialized(_this), "waitingMessages", []);

          _defineProperty(_assertThisInitialized(_this), "isConnected", false);

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

              this.client.send(_.isString(message) ? message : JSON.stringify(message));
            }
          }
        }]);

        return WebsocketConnector;
      }(Connector));
    }
  };
});