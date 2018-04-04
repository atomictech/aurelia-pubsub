"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var Config;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      _export("Config", Config = function () {
        function Config() {
          _classCallCheck(this, Config);

          Object.defineProperty(this, "connectors", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: {}
          });
          Object.defineProperty(this, "defaultConnector", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: null
          });
        }

        _createClass(Config, [{
          key: "registerConnector",
          value: function registerConnector(key, ConnectorCreator, config) {
            this.connectors[key] = ConnectorCreator.create(config);

            if (!this.defaultConnector && this.connectors[key]) {
              this.setDefaultConnector(this.connectors[key]);
            }

            return this;
          }
        }, {
          key: "getConnector",
          value: function getConnector(key) {
            if (!key) {
              return this.defaultConnector || null;
            }

            return this.connectors[key] || null;
          }
        }, {
          key: "hasConnector",
          value: function hasConnector(key) {
            return !!this.connectors[key];
          }
        }, {
          key: "setDefaultConnector",
          value: function setDefaultConnector(key) {
            this.defaultConnector = this.getConnector(key);
            return this;
          }
        }]);

        return Config;
      }());

      _export("Config", Config);
    }
  };
});