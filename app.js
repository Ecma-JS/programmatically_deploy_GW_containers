const express = require('express');
const app = express();
const router = express.Router();
const childProcess = require('child_process');
const machine = require('./VirtualMachineStent');
const machineProxy = require('./VirtualProxyStent');
const VirtualsProxy = require('./virtualsProxy');
const DockerMachine = require('./dockerMachine');

const path = __dirname;
const port = 3000;
let count = 0;
const proxy = new VirtualsProxy();

router.use(function (req,res,next) {
  next();
});

router.get('/app', async function(req,res){
  const dockerMachineName = 'Vbox'+ count;
  count++
  res.send(dockerMachineName);
  await proxy.connect();
  const machineDocument = proxy.create(dockerMachineName);
  console.log(machineDocument);
  await proxy.save(machineDocument);
  const dockerMachine = new DockerMachine(dockerMachineName);
  const stdoutCreate = await dockerMachine.createMachine();
  await proxy.findAndUpdate(machineDocument, stdoutCreate);
  const stdoutBuild = await dockerMachine.buildImage();
  await proxy.findAndUpdate(machineDocument, stdoutBuild);
  dockerMachine.runDocker();
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})