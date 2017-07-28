define(['exports', './messenger', './connectors/connector', './config'], function (exports, _messenger, _connector, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Config = exports.Connector = exports.Messenger = undefined;
  exports.configure = configure;
  function configure(aurelia, configCallback) {
    var config = aurelia.container.get(_config.Config);

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(config);
    }
  }

  exports.Messenger = _messenger.Messenger;
  exports.Connector = _connector.Connector;
  exports.Config = _config.Config;
});