'use strict';

System.register(['./messenger', './connectors/connector', './config'], function (_export, _context) {
  "use strict";

  var Messenger, Connector, Config;
  function configure(aurelia, configCallback) {
    var config = aurelia.container.get(Config);

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(config);
    }
  }

  _export('configure', configure);

  return {
    setters: [function (_messenger) {
      Messenger = _messenger.Messenger;
    }, function (_connectorsConnector) {
      Connector = _connectorsConnector.Connector;
    }, function (_config) {
      Config = _config.Config;
    }],
    execute: function () {
      _export('Messenger', Messenger);

      _export('Connector', Connector);

      _export('Config', Config);
    }
  };
});