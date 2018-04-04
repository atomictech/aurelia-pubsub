"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;
Object.defineProperty(exports, "Messenger", {
  enumerable: true,
  get: function get() {
    return _messenger.Messenger;
  }
});
Object.defineProperty(exports, "Connector", {
  enumerable: true,
  get: function get() {
    return _connector.Connector;
  }
});
Object.defineProperty(exports, "Config", {
  enumerable: true,
  get: function get() {
    return _config.Config;
  }
});

var _messenger = require("./messenger");

var _connector = require("./connectors/connector");

var _config = require("./config");

function configure(aurelia, configCallback) {
  var config = aurelia.container.get(_config.Config);

  if (configCallback === undefined || typeof configCallback !== 'function') {
    var error = 'You need to provide a callback method to properly configure the library';
    throw error;
  }

  configCallback(config);
}