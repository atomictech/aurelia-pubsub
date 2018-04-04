define(["exports", "./messenger", "./connectors/connector", "./config"], function (_exports, _messenger, _connector, _config) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.configure = configure;
  Object.defineProperty(_exports, "Messenger", {
    enumerable: true,
    get: function get() {
      return _messenger.Messenger;
    }
  });
  Object.defineProperty(_exports, "Connector", {
    enumerable: true,
    get: function get() {
      return _connector.Connector;
    }
  });
  Object.defineProperty(_exports, "Config", {
    enumerable: true,
    get: function get() {
      return _config.Config;
    }
  });

  function configure(aurelia, configCallback) {
    var config = aurelia.container.get(_config.Config);

    if (configCallback === undefined || typeof configCallback !== 'function') {
      var error = 'You need to provide a callback method to properly configure the library';
      throw error;
    }

    configCallback(config);
  }
});