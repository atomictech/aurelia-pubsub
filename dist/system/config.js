"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var Config;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export("Config", Config = function () {
        function Config() {
          _classCallCheck(this, Config);

          this.connectors = {};
          this.defaultConnector = null;
        }

        Config.prototype.registerConnector = function registerConnector(key, ConnectorCreator, config) {

          this.connectors[key] = ConnectorCreator.create(config);

          if (!this.defaultConnector && this.connectors[key]) {
            this.setDefaultConnector(this.connectors[key]);
          }

          return this;
        };

        Config.prototype.getConnector = function getConnector(key) {
          if (!key) {
            return this.defaultConnector || null;
          }

          return this.connectors[key] || null;
        };

        Config.prototype.hasConnector = function hasConnector(key) {
          return !!this.connectors[key];
        };

        Config.prototype.setDefaultConnector = function setDefaultConnector(key) {
          this.defaultConnector = this.getConnector(key);

          return this;
        };

        return Config;
      }());

      _export("Config", Config);
    }
  };
});