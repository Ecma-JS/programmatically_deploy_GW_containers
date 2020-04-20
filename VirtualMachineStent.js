const {Machine} = require('stent')
const { call } = require ('stent/lib/helpers');
const childProcess = require('child_process');

const machine = Machine.create('DockerMachine', {
  state: {name: 'idle'},
  transitions: {
    'idle': {
      'createDockerMachine': function * () {
        yield 'creating';
      },
      'buildImage': function * () {
        yield 'building';
;
      },
      'runDocker': function * () {
        yield 'running';
      }
    },
    'creating': {
      'success': function * () {
        yield 'idle';
      },
      'failed': function * () {
        console.log('failed')
        yield 'error';
        machine.error()
      }
    },
    'building': {
      'success': function * () {
        yield 'idle';
      },
      'failed': function * () {
        yield 'error';
      }
    },
    'running': {
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
        // yield 'idle';
      }
    }
  }
});

module.exports = machine;