"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Messenger = void 0;

var _aureliaDependencyInjection = require("aurelia-dependency-injection");

var _config = require("./config");

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Messenger = (_dec = (0, _aureliaDependencyInjection.resolver)(), _dec(_class = function () {
  function Messenger(key) {
    _classCallCheck(this, Messenger);

    this._key = key;
  }

  _createClass(Messenger, [{
    key: "get",
    value: function get(container) {
      return container.get(_config.Config).getConnector(this._key);
    }
  }], [{
    key: "of",
    value: function of(key) {
      return new Messenger(key);
    }
  }]);

  return Messenger;
}()) || _class);
exports.Messenger = Messenger;