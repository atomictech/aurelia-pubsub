"use strict";

System.register(["lodash", "stompjs", "./connector"], function (_export, _context) {
  "use strict";

  var _, Stomp, Connector, StompConnectorCreator, StompConnector;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_stompjs) {
      Stomp = _stompjs.Stomp;
    }, function (_connector) {
      Connector = _connector.Connector;
    }],
    execute: function () {
      _export("StompConnectorCreator", StompConnectorCreator = function () {
        function StompConnectorCreator() {
          _classCallCheck(this, StompConnectorCreator);
        }

        _createClass(StompConnectorCreator, null, [{
          key: "create",
          value: function create(config) {
            return new StompConnector(Stomp, config);
          }
        }]);

        return StompConnectorCreator;
      }());

      _export("StompConnector", StompConnector = function (_Connector) {
        _inherits(StompConnector, _Connector);

        var _super = _createSuper(StompConnector);

        function StompConnector(stomp) {
          var _this;

          var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          _classCallCheck(this, StompConnector);

          _this = _super.call(this);
          _this.stomp = stomp;
          _this.config = config;
          _this.waitingMessages = [];
          _this.waitingSubscriptions = [];
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

            if (_.has(this.config, 'heartbeat')) {
              this.client.heartbeat.outgoing = _.isUndefined(this.config.heartbeat.outgoing) ? 0 : parseInt(this.config.heartbeat.outgoing, 10);
              this.client.heartbeat.incoming = _.isUndefined(this.config.heartbeat.incoming) ? 10000 : parseInt(this.config.heartbeat.incoming, 10);
            }

            if (this.config.autoConnect) {
              this.start();
            }
          }
        }, {
          key: "_connectionCallback",
          value: function _connectionCallback() {
            this.isConnected = true;

            if (this.waitingSubscriptions.length) {
              this._doWaitingSubscriptions();
            }

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
            var _iterator = _createForOfIteratorHelper(this.waitingMessages),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var wrapper = _step.value;
                this.publish(this._forgeDestination(wrapper.destination, wrapper.toQueue), wrapper.message);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            this.waitingMessages = [];
          }
        }, {
          key: "_doWaitingSubscriptions",
          value: function _doWaitingSubscriptions() {
            var _iterator2 = _createForOfIteratorHelper(this.waitingSubscriptions),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var wrapper = _step2.value;

                this._clientSubscribe(wrapper.destination, wrapper.callback, wrapper.toQueue);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            this.waitingSubscriptions = [];
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
          key: "_bufferSubscription",
          value: function _bufferSubscription(wrapper) {
            this.waitingSubscriptions.push(wrapper);
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

              this.client.send(this._forgeDestination(destination, toQueue), _.merge({}, this.config.messageHeader, messageHeader), _.isString(message) ? message : JSON.stringify(message));
            }
          }
        }, {
          key: "subscribe",
          value: function subscribe(destination, callback) {
            var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (!this.isConnected) {
              var subscription = {
                destination: destination,
                callback: callback,
                toQueue: toQueue
              };

              this._bufferSubscription(subscription);
            } else {
              this._clientSubscribe(destination, callback, toQueue);
            }
          }
        }, {
          key: "_clientSubscribe",
          value: function _clientSubscribe(destination, callback) {
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
      }(Connector));
    }
  };
});