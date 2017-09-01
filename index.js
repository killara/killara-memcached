'use strict';

const debug = require('debug')('killara-memcached');
const EventEmitter = require('events');
const assert = require('assert');
const Memcached = require('memcached');

module.exports = class MemcachedStore extends EventEmitter {

  constructor(options) {
    options = options || {};

    const serverLocationsHelpMessage = `
      Should add serverLocations options to connect memcached.
      For example:
        String: 192.168.0.102:11211,
        Array: [ '192.168.0.102:11211', '192.168.0.103:11211', '192.168.0.104:11211' ]
        Object: { '192.168.0.102:11211': 1, '192.168.0.103:11211': 2, '192.168.0.104:11211': 1 }
    `;

    assert(option.serverLocations, serverLocationsHelpMessage);
    options.maxKeySize = options.maxKeySize || 250, // the maximum key size allowed.
    options.maxExpiration = options.maxExpiration || 2592000, // the maximum expiration time of keys (in seconds).
    options.maxValue = options.maxValue || 1048576, // the maximum size of a value.
    options.poolSize = options.poolSize || 10, // the maximum size of the connection pool.
    options.algorithm = options.algorithm || 'md5', // the hashing algorithm used to generate the hashRing values.
    options.reconnect = options.reconnect || 18000000, // the time between reconnection attempts (in milliseconds).
    options.timeout = options.timeout || 5000, // the time after which Memcached sends a connection timeout (in milliseconds).
    options.retries = options.retries || 5, // the number of socket allocation retries per request.
    options.failures = options.failures || 5, // the number of failed-attempts to a server before it is regarded as 'dead'.
    options.retry = options.retry || 30000, // the time between a server failure and an attempt to set it up back in service.
    options.remove = options.remove || false, // if true, authorizes the automatic removal of dead servers from the pool.
    options.failOverServers = options.failOverServers || undefined, // an array of server_locations to replace servers that fail and that are removed from the consistent hashing scheme.
    options.keyCompression = options.keyCompression || true, // whether to use md5 as hashing scheme when keys exceed maxKeySize.
    options.idle = options.idle || 5000 // the idle timeout for the connections.

    // result serialize/unserialize
    this.unserialize = options.unserialize || JSON.parse;
    this.serialize = options.serialize || JSON.stringify;

    this.client = new Memcached(options.serverLocations, options);
  }

  async get(sid) {
    try {
      const data = await new Promise((resolve, reject) => {
        this.client.get(sid, (err, data) => {
          if (err) return reject(err);
          debug('get %s > %s', data || 'empty');
          reolve(data);
        });
      });
      debug('get %s successfully');
      return this.unserialize(data.toString());
    } catch(e) {
      debug('get :%s > Error: %s', [sid, e.message])
      return null;
    }
  }

  async set(sid, data, lifetime) {
    lifetime = lifetime || 0;
    assert(typeof lifetime === 'number', 'Option `lifetime` should be a number in unit seconds');
    try {
      const value = this.serialize(data);
      await new Promise((resolve, reject) => {
        this.client.set(sid, value, lifetime, (err) => {
          if (err) return reject(err);
          debug('set %s value %s lifetime %s', [sid, value, lifetime]);
          reolve();
        });
      });
      debug('set %s successfully');
    } catch(e) {
      debug('set sid:%s failed. Error: %s', [sid, e.message]);
    }
  }

  async destory(sid) {
    try {
      await new Promise((resolve, reject) => {
        this.client.del(sid, (err) => {
          if (err) return reject(err);
          debug('del %s', [sid])
          reolve();
        });
      });
      debug('del %s successfully');
    } catch(e) {
      debug('del %s failed. Error: %s', [sid, e.message])
    }
  }
}