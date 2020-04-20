const { Machine } = require('stent')

const createFSM = (name) => {
  return Machine.create(name, {
    state: { name: 'idle' },
    transitions: {
      'idle': {
        'createDockerMachine': function* () {
          yield 'creating';
        },
        'buildImage': function* () {
          yield 'building';
          ;
        },
        'runDocker': function* () {
          yield 'running';
        }
      },
      'creating': {
        'success': function* () {
          yield 'idle';
        },
        'failed': function* () {
          console.log('failed')
          yield 'error';
        }
      },
      'building': {
        'success': function* () {
          yield 'idle';
        },
        'failed': function* () {
          yield 'error';
        }
      },
      'running': {
        'success': function* () {
          yield 'idle'
        },
        'failed': function* () {
          yield 'error'
        }
      },
      'error': {
        'error': function* () {
          console.log('ERROR');
          // yield 'idle';
        }
      }
    }
  });
}

module.exports = createFSM;