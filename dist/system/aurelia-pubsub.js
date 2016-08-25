'use strict';

System.register(['aurelia-framework', './messenger', './connectors/connector', './connectors/stomp-connector', './config'], function (_export, _context) {
  "use strict";

  var Aurelia, Messenger, Connector, StompConnectorCreator, StompConnector, Config;
  function configure(aurelia, configCallback) {
    var config = aurelia.container.get(Config);

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(config);
    }
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaFramework) {
      Aurelia = _aureliaFramework.Aurelia;
    }, function (_messenger) {
      Messenger = _messenger.Messenger;
    }, function (_connectorsConnector) {
      Connector = _connectorsConnector.Connector;
    }, function (_connectorsStompConnector) {
      StompConnectorCreator = _connectorsStompConnector.StompConnectorCreator;
      StompConnector = _connectorsStompConnector.StompConnector;
    }, function (_config) {
      Config = _config.Config;
    }],
    execute: function () {
      _export('Messenger', Messenger);

      _export('Connector', Connector);

      _export('StompConnectorCreator', StompConnectorCreator);

      _export('StompConnector', StompConnector);

      _export('Config', Config);
    }
  };
});