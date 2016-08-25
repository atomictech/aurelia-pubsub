'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = undefined;

var _aureliaFramework = require('aurelia-framework');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = exports.Config = function () {
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
}();