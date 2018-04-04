define(["exports", "lodash", "stompjs", "./connector"], function (_exports, _lodash, _stompjs, _connector) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StompConnector = _exports.StompConnectorCreator = void 0;
  _lodash = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var StompConnectorCreator = function () {
    function StompConnectorCreator() {
      _classCallCheck(this, StompConnectorCreator);
    }

    _createClass(StompConnectorCreator, null, [{
      key: "create",
      value: function create(config) {
        return new StompConnector(_stompjs.Stomp, config);
      }
    }]);

    return StompConnectorCreator;
  }();

  _exports.StompConnectorCreator = StompConnectorCreator;

  var StompConnector = function (_Connector) {
    _inherits(StompConnector, _Connector);

    function StompConnector(stomp) {
      var _this;

      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, StompConnector);

      _this = _possibleConstructorReturn(this, (StompConnector.__proto__ || Object.getPrototypeOf(StompConnector)).call(this));
      _this.stomp = stomp;
      _this.config = config;
      _this.waitingMessages = [];
      _this.isConnected = false;
      _this.localHeartbeat = null;
      _this.subscribeDestinations = {};

      _this.initialize();

      return _this;
    }

    _createClass(StompConnector, [{
      key: "initialize",
      value: function initialize() {
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
      key: "_errorCallback",
      value: function _errorCallback(err) {
        if (this.config.reconnectOnError) {
          this.initialize();
        }
      }
    }, {
      key: "_messageCallback",
      value: function _messageCallback() {}
    }, {
      key: "_publishWaitingMessages",
      value: function _publishWaitingMessages() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.waitingMessages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var wrapper = _step.value;
            this.publish(this._forgeDestination(wrapper.destination, wrapper.toQueue), wrapper.message);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: "_bufferMessage",
      value: function _bufferMessage(wrapper) {
        if (this.config.maxWaitingMessages && this.waitingMessages.length > this.config.maxWaitingMessages) {
          this.waitingMessages.shift();
          console.log('warning, StompConnector dropped waiting message, waiting buffer is full!');
        }

        this.waitingMessages.push(wrapper);
      }
    }, {
      key: "_clientCheck",
      value: function _clientCheck() {
        if (!this.client) {
          throw new Error('Cannot start stomp connector, no stomp client has been found.');
        }
      }
    }, {
      key: "_forgeDestination",
      value: function _forgeDestination(destination) {
        var toQueue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var output = toQueue ? '/queue/' : '/topic/';

        if (this.config.prefix) {
          output += this.config.prefix + '/';
        }

        output += destination;
        return output;
      }
    }, {
      key: "start",
      value: function start() {
        this._clientCheck();

        this.client.connect(this.config.login, this.config.password, this._connectionCallback.bind(this), this._errorCallback.bind(this), this.config.host);
      }
    }, {
      key: "stop",
      value: function stop() {
        this.subscribeDestinations = {};
        this.client.disconnect(this._disconnectionCallback.bind(this));
      }
    }, {
      key: "publish",
      value: function publish(destination, message) {
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
    }, {
      key: "subscribe",
      value: function subscribe(destination, callback) {
        var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        this.subscribeDestinations[destination] = this.client.subscribe(this._forgeDestination(destination, toQueue), callback);
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(destination) {
        this.subscribeDestinations[destination].unsubscribe();
      }
    }]);

    return StompConnector;
  }(_connector.Connector);

  _exports.StompConnector = StompConnector;
});