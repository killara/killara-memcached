# killara-memcached

[![npm](https://img.shields.io/npm/v/killara-memcached.svg)](https://www.npmjs.com/package/killara-memcached)
[![Travis branch](https://img.shields.io/travis/killara/killara-memcached/master.svg)](https://travis-ci.org/killara/killara-memcached)
[![Codecov branch](https://img.shields.io/codecov/c/github/killara/killara-memcached/master.svg)](https://codecov.io/github/killara/killara-memcached?branch=master)

a wrapper that be used with laravel-session as a session store

## Install

`npm i -S killara-memcached`

## Options

* `client`    memcached client (optional)
* `host`      memcached connect host (without options.client)
* `port`      memcached connect port (without options.client)
* `username`  username (if set, support SASL auth)
* `password`  password (if set, support SASL auth)

## LICENSE

MIT License

Copyright (c) 2017 killara

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.