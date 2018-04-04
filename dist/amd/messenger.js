define(["exports", "aurelia-dependency-injection", "./config"], function (_exports, _aureliaDependencyInjection, _config) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Messenger = void 0;

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
  _exports.Messenger = Messenger;
});