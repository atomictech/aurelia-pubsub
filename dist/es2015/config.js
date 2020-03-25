"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Config {
  constructor() {
    _defineProperty(this, "connectors", {});

    _defineProperty(this, "defaultConnector", null);
  }

  registerConnector(key, ConnectorCreator, config) {
    this.connectors[key] = ConnectorCreator.create(config);

    if (!this.defaultConnector && this.connectors[key]) {
      this.setDefaultConnector(this.connectors[key]);
    }

    return this;
  }

  getConnector(key) {
    if (!key) {
      return this.defaultConnector || null;
    }

    return this.connectors[key] || null;
  }

  hasConnector(key) {
    return !!this.connectors[key];
  }

  setDefaultConnector(key) {
    this.defaultConnector = this.getConnector(key);
    return this;
  }

}

exports.Config = Config;