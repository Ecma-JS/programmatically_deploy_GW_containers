const express = require('express');
const app = express();
const router = express.Router();
const createFSM = require('./VirtualMachineStent');
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
  const machine = createFSM(dockerMachineName);
  const dockerMachine = new DockerMachine(dockerMachineName, machine, proxy);
  await dockerMachine.createMachine();

  await dockerMachine.buildImage();

  await dockerMachine.runDocker();
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})