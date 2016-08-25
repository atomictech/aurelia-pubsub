'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = exports.StompConnector = exports.StompConnectorCreator = exports.Connector = exports.Messenger = undefined;
exports.configure = configure;

var _aureliaFramework = require('aurelia-framework');

var _messenger = require('./messenger');

var _connector = require('./connectors/connector');

var _stompConnector = require('./connectors/stomp-connector');

var _config = require('./config');

function configure(aurelia, configCallback) {
  var config = aurelia.container.get(_config.Config);

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(config);
  }
}

exports.Messenger = _messenger.Messenger;
exports.Connector = _connector.Connector;
exports.StompConnectorCreator = _stompConnector.StompConnectorCreator;
exports.StompConnector = _stompConnector.StompConnector;
exports.Config = _config.Config;