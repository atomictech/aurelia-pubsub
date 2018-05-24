# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.6.0"></a>
# [0.6.0](https://github.com/atomictech/aurelia-pubsub/compare/v0.5.1...v0.6.0) (2018-05-24)


### Features

* **all:** Upgrade of the dependencies, code linting, use of babel@7 and es6 in gulp tasks. ([9222dcd](https://github.com/atomictech/aurelia-pubsub/commit/9222dcd))
* **websocket:** Addition of a new connector to connect to a (raw, as opposed to socket.io) websocket server ([63e14d3](https://github.com/atomictech/aurelia-pubsub/commit/63e14d3))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/atomictech/aurelia-pubsub/compare/v0.5.0...v0.5.1) (2017-07-28)


### Bug Fixes

* **socket.io:** Use of emit function instead of send to prevent the fixed topic ‘message’. ([6114e48](https://github.com/atomictech/aurelia-pubsub/commit/6114e48))
* **tools:** Downgrade gulp-eslint until aurelia-tools/.eslintrc.json is compatible with 4.0.0 ([699a7dd](https://github.com/atomictech/aurelia-pubsub/commit/699a7dd))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/atomictech/aurelia-pubsub/compare/0.4.2...v0.5.0) (2017-07-28)


### Bug Fixes

* **stomp:** Prevent the hard dependency of stompjs when not using the StompConnector. It has to be installed as a peer dependency by the library’s user. ([5a332a3](https://github.com/atomictech/aurelia-pubsub/commit/5a332a3))
* **stomp:** subscribe destinations is an object rather than an array. ([8511607](https://github.com/atomictech/aurelia-pubsub/commit/8511607))


### Features

* **socket-io:** Addition of the socket.io connector. ([2f1b810](https://github.com/atomictech/aurelia-pubsub/commit/2f1b810))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/atomictech/aurelia-pubsub/compare/7bd083a...0.4.2) (2017-02-09)


### Bug Fixes

* **StompConnector:** changed the way Stomp lib is passed to the class ([7bd083a](https://github.com/atomictech/aurelia-pubsub/commit/7bd083a))
* **StompConnector:** fixed heartbeat problem with ActiveMQ ([a2d6bc5](https://github.com/atomictech/aurelia-pubsub/commit/a2d6bc5))
* **StompConnector:** Fixes the include of stompjs. ([daa61d0](https://github.com/atomictech/aurelia-pubsub/commit/daa61d0))
