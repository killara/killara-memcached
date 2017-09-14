'use strict';

const debug = require('debug')('killara:memcached');
const EventEmitter = require('events');
const assert = require('assert');
const Memcached = require('node_memcached');

module.exports = class MemcachedStore extends EventEmitter {

  constructor(options) {
    super();
    options = options || {};

    if (!options.client) {
      debug('Init memcached client with host: %s, port: %d',
        options.host || 'localhost', options.port || 11211);
      this.client = Memcached.createClient(options.username, options.password);
    } else {
      this.client = options.client;
    }

    // result serialize/unserialize
    this.serialize = (typeof options.serialize === 'function' && options.serialize) || JSON.stringify;
    this.unserialize = (typeof options.unserialize === 'function' && options.unserialize) || JSON.parse;

    this.client.on('error', this.emit.bind(this, 'disconnect'));
    this.client.on('end', this.emit.bind(this, 'disconnect'));
    this.client.on('connect', this.emit.bind(this, 'connect'));

    this.on('disconnect', err => {
      if (err) {
        debug('disconnet: %s', err.toString());
      }
    });
    this.on('connect', () => {
      debug('connect successfully');
    });
  }

  async get(sid) {
    try {
      const data = await new Promise((resolve, reject) => {
        this.client.get(sid, (err, data) => {
          if (err) return reject(err);
          debug('get %s; %s', sid, data || 'empty');
          resolve(data);
        });
      });
      if (!data) {
        return null;
      }
      const dataRaw = this.unserialize(data.toString());
      debug('get %s successfully', sid);
      return dataRaw;
    } catch (e) {
      debug('get %s; Error: %s', sid, e.message);
      return null;
    }
  }

  async set(sid, data, lifetime) {
    lifetime = lifetime || 0;
    assert(typeof lifetime === 'number', 'Option `lifetime` should be a number in unit seconds');
    try {
      const value = this.serialize(data);
      await new Promise((resolve, reject) => {
        this.client.set(sid, value, lifetime, err => {
          if (err) return reject(err);
          debug('set %s value %s lifetime %s', sid, value, lifetime);
          resolve();
        });
      });
      debug('set %s successfully', sid);
    } catch (e) {
      debug('set sid:%s failed. Error: %s', sid, e.message);
    }
  }

  async destroy(sid) {
    try {
      await new Promise((resolve, reject) => {
        this.client.delete(sid, err => {
          if (err) return reject(err);
          debug('del %s', sid);
          resolve();
        });
      });
      debug('del %s successfully', sid);
    } catch (e) {
      debug('del %s failed. Error: %s', sid, e.message);
    }
  }
};
