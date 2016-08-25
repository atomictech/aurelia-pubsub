define(['exports', 'aurelia-framework', './messenger', './connectors/connector', './connectors/stomp-connector', './config'], function (exports, _aureliaFramework, _messenger, _connector, _stompConnector, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Config = exports.StompConnector = exports.StompConnectorCreator = exports.Connector = exports.Messenger = undefined;
  exports.configure = configure;
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
});