export class Connector {
  start() {
    throw new Error('Cannot use abstract Connector.');
  }

  stop() {
    throw new Error('Cannot use abstract Connector.');
  }

  publish(destination, message, toQueue = false, messageHeader) {
    throw new Error('Cannot use abstract Connector.');
  }

  subscribe(destination, callback, toQueue = false) {
    throw new Error('Cannot use abstract Connector.');
  }

  unsubscribe(destination) {
    throw new Error('Cannot use abstract Connector.');
  }
}
