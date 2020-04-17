const {Machine} = require('stent')
const { call } = require ('stent/lib/helpers');
const mongoose = require('mongoose');

const machineProxy = Machine.create('ProxyMachine', {
  state: {name: 'idle'},
  transitions: {
    'idle': {
      'connectToMongo': function * () {
        yield 'connecting';
      },
      'save': function * () {
        yield 'saving';
;
      },
      'update': function * () {
        yield 'updating';
      }
    },
    'connecting': {
      'success': function * () {
        yield 'idle';
      },
      'failed': function * () {
        yield 'error';
      }
    },
    'saving': {
      'success': function * () {
        yield 'idle';
      },
      'failed': function * () {
        yield 'error';
      }
    },
    'updating': {
      'success': function * () {
        yield 'idle'
      },
      'failed': function * () {
        yield 'error'
      }
    },
    'error': {
      'error': function * () {
        console.log('ERROR');
        yield 'idle';
      }
    }
  }
});

module.exports = machineProxy;
