import { Messenger } from './messenger';
import { Connector } from './connectors/connector';
import { Config } from './config';

export function configure(aurelia, configCallback) {
  let config = aurelia.container.get(Config);

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(config);
  }
}

export { Messenger, Connector, Config };