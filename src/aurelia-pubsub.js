import { Aurelia } from 'aurelia-framework';
import { Messenger } from './messenger'
import { Connector } from './connectors/connector'
import { StompConnectorCreator, StompConnector } from './connectors/stomp-connector'
import { Config } from './config';

export function configure(aurelia, configCallback) {
  let config = aurelia.container.get(Config);

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(config);
  }
}

export {
  Messenger,
  Connector,
  StompConnectorCreator,
  StompConnector,
  Config
};
