define(['exports', 'aurelia-dependency-injection', './config'], function (exports, _aureliaDependencyInjection, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Messenger = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Messenger = exports.Messenger = (_dec = (0, _aureliaDependencyInjection.resolver)(), _dec(_class = function () {
    function Messenger(key) {
      _classCallCheck(this, Messenger);

      this._key = key;
    }

    Messenger.prototype.get = function get(container) {
      return container.get(_config.Config).getConnector(this._key);
    };

    Messenger.of = function of(key) {
      return new Messenger(key);
    };

    return Messenger;
  }()) || _class);
});