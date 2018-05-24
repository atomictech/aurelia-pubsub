import _ from 'lodash';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { Connector } from './connector';

export class WebsocketConnectorCreator {
  static create(config) {
    return new WebsocketConnector(ReconnectingWebSocket, config);
  }
}

export class WebsocketConnector extends Connector {
  waitingMessages = [];
  isConnected = false;

  constructor(rws, config = {}) {
    super();

    this.rws = rws;
    this.config = config;

    this.initialize();
  }

  initialize() {
    this.client = new this.rws(this.config.endpoint);  // eslint-disable-line new-cap

    this.client.addEventListener('open', this._connectionCallback.bind(this));
    this.client.addEventListener('close', this._disconnectionCallback.bind(this));
    this.client.addEventListener('message', this._messageCallback.bind(this));
  }

  _connectionCallback() {
    this.isConnected = true;

    if (this.waitingMessages.length) {
      this._publishWaitingMessages();
    }
  }

  _disconnectionCallback() {
    this.isConnected = false;
    this.waitingMessages = [];
  }

  _messageCallback() {

  }

  _publishWaitingMessages() {
    this.waitingMessages.forEach(wrapper => {
      this.publish(wrapper.destination, wrapper.message);
    });
  }

  _bufferMessage(wrapper) {
    if (this.config.maxWaitingMessages && this.waitingMessages.length > this.config.maxWaitingMessages) {
      this.waitingMessages.shift();
      console.log('warning, WSConnector dropped waiting message, waiting buffer is full!');
    }
    this.waitingMessages.push(wrapper);
  }

  _clientCheck() {
    if (!this.client) {
      throw new Error('Cannot start ws connector, no ws client has been found.');
    }
  }

  stop() {
    this.client.close();
  }

  publish(destination, message) {
    if (!this.isConnected) {
      let messageWrapper = {
        destination: destination,
        message: message
      };
      this._bufferMessage(messageWrapper);
    } else {
      this._clientCheck();
      this.client.send(_.isString(message) ? message : JSON.stringify(message));
    }
  }
}
