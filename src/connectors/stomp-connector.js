import _ from 'lodash';
import * as Stomp from 'stompjs';

import { inject } from 'aurelia-framework';
import { Connector } from './connector';

export class StompConnectorCreator {
  static create(config) {
    return new StompConnector(Stomp, config);
  }
}

export class StompConnector extends Connector {
  constructor(stomp, config = {}) {
    super();

    this.stomp = stomp;
    this.config = config;

    this.waitingMessages = [];
    this.isConnected = false;
    this.localHeartbeat = null;
    this.subscribeDestinations = {};

    this.initialize();
  }

  initialize() {
    this.client = new this.stomp.client(this.config.endpoint);
    if (!this.config.debug) {
      this.client.debug = null;
    }

    if (_.has(this.config, 'heartbeat')) {
      this.client.heartbeat.outgoing = _.isUndefined(this.config.heartbeat.outgoing) ? 0 : parseInt(this.config.heartbeat.outgoing, 10);
      this.client.heartbeat.incoming = _.isUndefined(this.config.heartbeat.incoming) ? 10000 : parseInt(this.config.heartbeat.incoming, 10);
    }

    if (this.config.autoConnect) {
      this.start();
    }
  }

  _connectionCallback() {
    this.isConnected = true;

    // if (this.config.heartbeat.force) {
    //   this._handleHeartbeat();
    // }

    if (this.waitingMessages.length) {
      this._publishWaitingMessages();
    }
  }

  _disconnectionCallback() {
    this.isConnected = false;
    this.waitingMessages = [];

    // if (this.config.heartbeat.force || this.localHeartbeat) {
    //   this._stopHeartbeat();
    // }
  }

  _errorCallback(err) {
    if (this.config.reconnectOnError) {
      this.initialize();
    }
  }

  _messageCallback() {

  }

  _publishWaitingMessages() {
    for (let wrapper of this.waitingMessages) {
      this.publish(this._forgeDestination(wrapper.destination, wrapper.toQueue), wrapper.message);
    }
  }

  _bufferMessage(wrapper) {
    if (this.config.maxWaitingMessages && this.waitingMessages.length > this.config.maxWaitingMessages) {
      this.waitingMessages.shift();
      console.log("warning, StompConnector dropped waiting message, waiting buffer is full!");
    }
    this.waitingMessages.push(wrapper);
  }

  _clientCheck() {
    if (!this.client) {
      throw new Error('Cannot start stomp connector, no stomp client has been found.');
    }
  }

  // _handleHeartbeat() {
  //   if (_.has(this.config.heartbeat, 'outgoing')) {
  //     this.localHeartbeat = setInterval(() => {
  //       this.publish(this.config.heartbeat.destination, {});
  //     }, this.config.heartbeat.outgoing);
  //   }
  // }

  // _stopHeartbeat() {
  //   clearInterval(this.localHeartbeat);
  // }

  _forgeDestination(destination, toQueue = false) {
    let output = toQueue ? '/queue/' : '/topic/';

    if (this.config.prefix) {
      output += this.config.prefix + '/';
    }

    output += destination;
    return output;
  }

  start() {
    this._clientCheck();
    this.client.connect(this.config.login, this.config.password, this._connectionCallback.bind(this), this._errorCallback.bind(this), this.config.host);
  }

  stop() {
    this.subscribeDestinations = [];
    this.client.disconnect(this._disconnectionCallback.bind(this));
  }

  publish(destination, message, toQueue = false, messageHeader) {
    if (!this.isConnected) {
      let messageWrapper = {};
      messageWrapper.toQueue = toQueue;
      messageWrapper.destination = destination;
      messageWrapper.message = message;
      this._bufferMessage(messageWrapper);
    } else {
      this._clientCheck();
      this.client.send(this._forgeDestination(destination, toQueue),
        _.merge({}, this.config.messageHeader, messageHeader),
        _.isString(message) ? message : JSON.stringify(message));
    }
  }

  subscribe(destination, callback, toQueue = false) {
    this.subscribeDestinations[destination] = this.client.subscribe(this._forgeDestination(destination, toQueue), callback);
  }

  unsubscribe(destination) {
    this.subscribeDestinations[destination].unsubscribe();
  }
}
