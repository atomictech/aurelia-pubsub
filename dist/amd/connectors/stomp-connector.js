define(['exports', 'stompjs', 'aurelia-framework', './connector'], function (exports, _stompjs, _aureliaFramework, _connector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.StompConnector = exports.StompConnectorCreator = undefined;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var StompConnectorCreator = exports.StompConnectorCreator = (_dec = (0, _aureliaFramework.inject)(_stompjs.Stomp), _dec(_class = function () {
    function StompConnectorCreator(stomp) {
      _classCallCheck(this, StompConnectorCreator);

      this.stomp = stomp;
    }

    StompConnectorCreator.create = function create(config) {
      return new StompConnector(this.stomp, config);
    };

    return StompConnectorCreator;
  }()) || _class);

  var StompConnector = exports.StompConnector = function (_Connector) {
    _inherits(StompConnector, _Connector);

    function StompConnector(stomp) {
      var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, StompConnector);

      var _this = _possibleConstructorReturn(this, _Connector.call(this));

      _this.stomp = stomp;
      _this.config = config;

      _this.waitingMessages = [];
      _this.isConnected = false;
      _this.localHeartbeat = null;
      _this.subscribeDestinations = {};

      _this.initialize();
      return _this;
    }

    StompConnector.prototype.initialize = function initialize() {
      this.client = new this.stomp.overWS(this.config.endpoint);

      if (this.config.autoConnect) {
        this.start();
      }
    };

    StompConnector.prototype._connectionCallback = function _connectionCallback() {
      this.isConnected = true;

      if (this.config.heartbeat.force) {
        this._handleHeartbeat();
      } else {
        this.client.heartbeat.outgoing = this.config.heartbeat.outgoing;
        this.client.heartbeat.incoming = this.config.heartbeat.incoming;
      }

      if (this.waitingMessages.length) {
        this._publishWaitingMessages();
      }
    };

    StompConnector.prototype._disconnectionCallback = function _disconnectionCallback() {
      this.isConnected = false;
      this.waitingMessages = [];

      if (this.config.heartbeat.force || this.localHeartbeat) {
        this._stopHeartbeat();
      }
    };

    StompConnector.prototype._errorCallback = function _errorCallback() {};

    StompConnector.prototype._messageCallback = function _messageCallback() {};

    StompConnector.prototype._publishWaitingMessages = function _publishWaitingMessages() {
      for (var _iterator = this.waitingMessages, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var wrapper = _ref;

        this.publish(this._forgeDestination(wrapper.destination, wrapper.toQueue), wrapper.message);
      }
    };

    StompConnector.prototype._bufferMessage = function _bufferMessage(wrapper) {
      if (this.config.maxWaitingMessages && this.waitingMessages.length > this.config.maxWaitingMessages) {
        this.waitingMessages.shift();
        console.log("warning, StompConnector dropped waiting message, waiting buffer is full!");
      }
      this.waitingMessages.push(wrapper);
    };

    StompConnector.prototype._clientCheck = function _clientCheck() {
      if (!this.client) {
        throw new Error('Cannot start stomp connector, no stomp client has been found.');
      }
    };

    StompConnector.prototype._handleHeartbeat = function _handleHeartbeat() {
      var _this2 = this;

      this.localHeartbeat = setInterval(function () {
        _this2.publish(_this2.config.heartbeat.destination, {});
      }, this.config.outgoing);
    };

    StompConnector.prototype._stopHeartbeat = function _stopHeartbeat() {
      clearInterval(this.localHeartbeat);
    };

    StompConnector.prototype._forgeDestination = function _forgeDestination(destination) {
      var toQueue = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var output = toQueue ? '/queue/' : '/topic/';

      if (this.config.prefix) {
        output += this.config.prefix + '/';
      }

      output += destination;
    };

    StompConnector.prototype.start = function start() {
      this._clientCheck();
      this.client.connect(this.config.login, this.config.password, this._connectionCallback, this._errorCallback, this.config.host);
    };

    StompConnector.prototype.stop = function stop() {
      this.subscribeDestinations = [];
      this.client.disconnect(this._disconnectionCallback);
    };

    StompConnector.prototype.publish = function publish(destination, message) {
      var toQueue = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var messageHeader = arguments[3];

      if (!this.isConnected) {
        var messageWrapper = {};
        messageWrapper.toQueue = toQueue;
        messageWrapper.destination = destination;
        messageWrapper.message = message;
        this._bufferMessage(messageWrapper);
      } else {
        this._clientCheck();
        this.client.send(this._forgeDestination(destination, toQueue), _.merge({}, this.config.messageHeader, messageHeader), message);
      }
    };

    StompConnector.prototype.subscribe = function subscribe(destination, callback) {
      var toQueue = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      this.subscribeDestinations[destination] = this.client.subscribe(this._forgeDestination(destination, toQueue), callback);
    };

    StompConnector.prototype.unsubscribe = function unsubscribe(destination) {
      this.subscribeDestinations[destination].unsubscribe();
    };

    return StompConnector;
  }(_connector.Connector);
});