const express = require('express');
const app = express();
const router = express.Router();
const childProcess = require('child_process');
const machine = require('./VirtualMachineStent');
const machineProxy = require('./VirtualProxyStent');

const path = __dirname;
const port = 3000;
let dockerMachineName = 0;

router.use(function (req,res,next) {
  next();
});

router.get('/app', function(req,res){
  
  machine.state.dockerMachineName = dockerMachineName; 
  machineProxy.state.payload = dockerMachineName;
  machine.createDockerMachine();
  machineProxy.create();
  dockerMachineName++
  res.send(dockerMachineName.toString());
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})