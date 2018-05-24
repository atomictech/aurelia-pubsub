define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Config = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var Config = function () {
    function Config() {
      _classCallCheck(this, Config);

      _defineProperty(this, "connectors", {});

      _defineProperty(this, "defaultConnector", null);
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
  }();

  _exports.Config = Config;
});