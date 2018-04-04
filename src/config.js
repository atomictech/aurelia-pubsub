/**
 * Config class. Configures and stores connectors services
 */
export class Config {
  constructor() {}

  connectors = {};
  defaultConnector = null;

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
