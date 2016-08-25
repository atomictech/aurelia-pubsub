import { Container, resolver } from 'aurelia-dependency-injection';
import { Config } from './config';

@resolver()
export class Messenger {

  constructor(key) {
    this._key = key;
  }

  get(container) {
    return container.get(Config).getConnector(this._key);
  }

  static of(key) {
    return new Messenger(key)
  }

}
