"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Messenger = void 0;

var _aureliaDependencyInjection = require("aurelia-dependency-injection");

var _config = require("./config");

var _dec, _class;

var Messenger = (_dec = (0, _aureliaDependencyInjection.resolver)(), _dec(_class = class Messenger {
  constructor(key) {
    this._key = key;
  }

  get(container) {
    return container.get(_config.Config).getConnector(this._key);
  }

  static of(key) {
    return new Messenger(key);
  }

}) || _class);
exports.Messenger = Messenger;