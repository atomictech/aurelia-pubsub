'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Connector = exports.Connector = function () {
  function Connector() {
    _classCallCheck(this, Connector);
  }

  Connector.prototype.start = function start() {
    throw new Error('Cannot use abstract Connector.');
  };

  Connector.prototype.stop = function stop() {
    throw new Error('Cannot use abstract Connector.');
  };

  Connector.prototype.publish = function publish(destination, message) {
    var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var messageHeader = arguments[3];

    throw new Error('Cannot use abstract Connector.');
  };

  Connector.prototype.subscribe = function subscribe(destination, callback) {
    var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    throw new Error('Cannot use abstract Connector.');
  };

  Connector.prototype.unsubscribe = function unsubscribe(destination) {
    throw new Error('Cannot use abstract Connector.');
  };

  return Connector;
}();