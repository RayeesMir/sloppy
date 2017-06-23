require('babel-core/register')

const winston = require('winston')

// overwrite all package config keys to avoid any real infrastructure connections
Object.keys(process.env)
  .filter(key => /npm_package_config_/.test(key))
  .forEach((key) => {
    process.env[key] = 'http://localhost:666'
  })

global.chai = require('chai')
global.expect = require('chai').expect
global.sinon = require('sinon')
global.request = require('supertest')
global.app = require('../src/app').default

winston.level = 'error'

// this makes any network activity through this module show up
// in console, making global much easier to spot missing stubs
require('request').debug = true
