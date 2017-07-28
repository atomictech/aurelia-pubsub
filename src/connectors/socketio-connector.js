import socketio from 'socket.io-client';
import { Connector } from './connector';

export class SocketIOConnectorCreator {
  static create(config) {
    return new SocketIOConnector(socketio, config);
  }
}

export class SocketIOConnector extends Connector {
  constructor(io, config = {}) {
    super();

    this.io = io;
    this.config = config;

    this.waitingMessages = [];
    this.isConnected = false;
    this.subscribeDestinations = {};

    this.initialize();
  }

  initialize() {
    this.client = new this.io(this.config.url, this.config.io);

    this.client.on('connect', this._connectionCallback.bind(this));
    this.client.on('disconnect', this._disconnectionCallback.bind(this));
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
      console.log('warning, IOConnector dropped waiting message, waiting buffer is full!');
    }
    this.waitingMessages.push(wrapper);
  }

  _clientCheck() {
    if (!this.client) {
      throw new Error('Cannot start io connector, no io client has been found.');
    }
  }

  start() {
    this._clientCheck();
    this.client.open();
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
      this.client.emit(destination, message, this._messageCallback.bind(this));
    }
  }

  subscribe(destination, callback) {
    this.subscribeDestinations[destination] = callback;
    this.client.on(destination, callback);
  }

  unsubscribe(destination) {
    delete this.subscribeDestinations[destination];
    this.client.off(destination);
  }
}
