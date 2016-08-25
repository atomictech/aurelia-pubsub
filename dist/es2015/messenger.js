var _dec, _class;

import { Container, resolver } from 'aurelia-dependency-injection';
import { Config } from './config';

export let Messenger = (_dec = resolver(), _dec(_class = class Messenger {

  constructor(key) {
    this._key = key;
  }

  get(container) {
    return container.get(Config).getConnector(this._key);
  }

  static of(key) {
    return new Messenger(key);
  }

}) || _class);