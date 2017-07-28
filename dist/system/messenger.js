'use strict';

System.register(['aurelia-dependency-injection', './config'], function (_export, _context) {
  "use strict";

  var resolver, Config, _dec, _class, Messenger;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      resolver = _aureliaDependencyInjection.resolver;
    }, function (_config) {
      Config = _config.Config;
    }],
    execute: function () {
      _export('Messenger', Messenger = (_dec = resolver(), _dec(_class = function () {
        function Messenger(key) {
          _classCallCheck(this, Messenger);

          this._key = key;
        }

        Messenger.prototype.get = function get(container) {
          return container.get(Config).getConnector(this._key);
        };

        Messenger.of = function of(key) {
          return new Messenger(key);
        };

        return Messenger;
      }()) || _class));

      _export('Messenger', Messenger);
    }
  };
});