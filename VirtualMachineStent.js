const {Machine} = require('stent')
const { call } = require ('stent/lib/helpers');
const childProcess = require('child_process');

function createMachine (dockerMachineName) {
  return new Promise ((res, rej) => {
    const req = 'docker-machine create --driver virtualbox --virtualbox-cpu-count -1 '+ dockerMachineName;
    console.log(req)

    childProcess.exec(req, 
      (err, stdout, stderr) => {
        console.log(stdout, stderr);
        res(stdout);
      })
  })
}

function buildImage (dockerMachineName) {
  return new Promise ((res, rej) => {

    childProcess.exec('bash build ' + dockerMachineName, (err, stdout, stderr) => {
      console.log(stdout, stderr);
      res(stdout)
    })
  })
}

function runDocker (dockerMachineName) {
  childProcess.exec('bash run ' + dockerMachineName);
}

const machine = Machine.create('DockerMachine', {
  state: {name: 'idle', dockerMachineName: null},
  transitions: {
    'idle': {
      'createDockerMachine': function * () {
        console.log(machine.state.dockerMachineName)
        yield { name: 'creating', dockerMachineName: machine.state.dockerMachineName};
        machine.createMachine();
      },
      'buildImage': function * () {
        yield { name: 'building', dockerMachineName: machine.state.dockerMachineName};
        machine.build();
      },
      'runDocker': function  () {
        runDocker(machine.state.dockerMachineName)
      }
    },
    'creating': {
      'createMachine': function * () {
        yield call(createMachine, machine.state.dockerMachineName);
        yield { name: 'idle', dockerMachineName: machine.state.dockerMachineName};
        machine.buildImage();
      }
    },
    'building': {
      'build': function * () {
        yield call(buildImage, machine.state.dockerMachineName);
        yield { name: 'idle', dockerMachineName: machine.state.dockerMachineName};
        machine.runDocker();
      }
    }
  }
});

module.exports = machine;