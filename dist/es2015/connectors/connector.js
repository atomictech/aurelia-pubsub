"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Connector = void 0;

class Connector {
  start() {
    throw new Error('Cannot use abstract Connector.');
  }

  stop() {
    throw new Error('Cannot use abstract Connector.');
  }

  publish(destination, message) {
    var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var messageHeader = arguments.length > 3 ? arguments[3] : undefined;
    throw new Error('Cannot use abstract Connector.');
  }

  subscribe(destination, callback) {
    var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    throw new Error('Cannot use abstract Connector.');
  }

  unsubscribe(destination) {
    throw new Error('Cannot use abstract Connector.');
  }

}

exports.Connector = Connector;