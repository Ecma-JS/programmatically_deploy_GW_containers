const childProcess = require('child_process');
const machine = require('./VirtualMachineStent')

class DockerMachine {
  constructor (machineName) {
    this.dockerMachineName = machineName;
  }

  createMachine() {
    machine.createDockerMachine();
    return new Promise ((res, rej) => {
      const req = 'docker-machine create --driver virtualbox --virtualbox-cpu-count -1 '+ this.dockerMachineName;
      console.log(req)
      childProcess.exec(req, 
        (err, stdout, stderr) => {
          if(err) {machine.failed()}
          else {
            console.log(stdout, stderr);
            const response = stdout + stderr;
            res(response);
            machine.success();
          }

        })
    })
  }

  buildImage () {
    machine.buildImage();
    return new Promise ((res, rej) => {
      childProcess.exec('bash build ' + this.dockerMachineName, (err, stdout, stderr) => {
        if(err) {machine.failed()}
        else {
          console.log(stdout, stderr);
          const response = stdout + stderr;
          res(response);
          machine.success();
        }
      })
    })
  }

  runDocker () {
    machine.runDocker();
    return new Promise((res, rej) => {
      childProcess.exec('bash run ' + this.dockerMachineName, (err) => {
        rej(err);
        machine.failed();
      });
      machine.success();
    })

  }
}

module.exports = DockerMachine;
