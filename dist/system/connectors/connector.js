"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var Connector;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      _export("Connector", Connector = function () {
        function Connector() {
          _classCallCheck(this, Connector);
        }

        _createClass(Connector, [{
          key: "start",
          value: function start() {
            throw new Error('Cannot use abstract Connector.');
          }
        }, {
          key: "stop",
          value: function stop() {
            throw new Error('Cannot use abstract Connector.');
          }
        }, {
          key: "publish",
          value: function publish(destination, message) {
            var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var messageHeader = arguments.length > 3 ? arguments[3] : undefined;
            throw new Error('Cannot use abstract Connector.');
          }
        }, {
          key: "subscribe",
          value: function subscribe(destination, callback) {
            var toQueue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            throw new Error('Cannot use abstract Connector.');
          }
        }, {
          key: "unsubscribe",
          value: function unsubscribe(destination) {
            var subscriptionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            throw new Error('Cannot use abstract Connector.');
          }
        }]);

        return Connector;
      }());
    }
  };
});