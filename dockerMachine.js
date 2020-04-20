const childProcess = require('child_process');

class DockerMachine {
  constructor (machineName, machine, proxy) {
    this.dockerMachineName = machineName;
    this.machine = machine;
    this.proxy = proxy;
  }

  async createMachine() {
    const count = Math.floor(Math.random() * 10);
    console.log('Create machine: count = ', count)
    this.machineDocument = this.proxy.create(this.dockerMachineName);
    await this.proxy.save(this.machineDocument);
    this.machine.createDockerMachine();
    return new Promise ((res, rej) => {
      const req = 'docker-machine create --driver virtualbox --virtualbox-cpu-count -1 '+ this.dockerMachineName;
      console.log(req)
      if(count%2 == 0) {
        childProcess.exec(req, 
          async (err, stdout, stderr) => {
             if(err) {
               this.machine.failed()
             } else {
               console.log(stdout, stderr);
               const response = stdout + stderr;
               await this.proxy.findAndUpdate(this.machineDocument, response);
               res(response);
               this.machine.success();
             }
           })
      } else {
        this.machine.failed()
        res('error create machine')
      }
    })
  }

  buildImage () {
    const count = Math.floor(Math.random() * 10);
    console.log('Build image: count = ', count)
    this.machine.buildImage();
    return new Promise ((res, rej) => {
      if(count%2 == 0) {
        childProcess.exec('bash build ' + this.dockerMachineName, async (err, stdout, stderr) => {
          if(err) {
            this.machine.failed()
          } else {
            console.log(stdout, stderr);
            const response = stdout + stderr;
            await this.proxy.findAndUpdate(this.machineDocument, response);
            res(response);
            this.machine.success();
          }
        })
      } else {
        this.machine.failed()
        res('error build image')
      }

    })
  }

  runDocker () {
    const count = Math.floor(Math.random() * 10);
    console.log('Run Docker: count = ', count)
    this.machine.runDocker();
    return new Promise((res, rej) => {
      if(count%2 == 0) {
        childProcess.exec('bash run ' + this.dockerMachineName, (err) => {
          if(err) {
            this.machine.failed();
          } else {
            this.machine.success();
            res();
          }
        });
      } else {
        this.machine.failed()
        res('error run')
      }
    })
  }
}

module.exports = DockerMachine;
