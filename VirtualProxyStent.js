const {Machine} = require('stent')
const { call } = require ('stent/lib/helpers');
const mongoose = require('mongoose');
const VirtualsProxy = require('./virtualsProxy')

const MONGO_URI = 'mongodb+srv://user:q1q1@cluster0-fqcrd.gcp.mongodb.net/test?retryWrites=true&w=majority';

const proxy = new VirtualsProxy();

const machineProxy = Machine.create('ProxyMachine', {
  state: {name: 'idle', payload: null},
  transitions: {
    'idle': {
      'create': function * () {
        yield {name: 'creating', payload: machineProxy.state.payload};
        machineProxy.connect();
      },
      'save': function () {
        proxy.save();
      }

    },
    'creating': {
      'connect': function * () {
        yield call(proxy.connect);
        machineProxy.createDocument();
      },
      'createDocument':  function * () {
        proxy.create(machineProxy.state.payload);
        yield {name: 'idle', payload: machineProxy.state.payload};
        machineProxy.save();
      }
    }
  }
})

module.exports = machineProxy;