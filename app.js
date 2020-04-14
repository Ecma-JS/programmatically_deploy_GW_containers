const express = require('express');
const app = express();
const router = express.Router();
const childProcess = require('child_process');

const path = __dirname;
const port = 3000;
let dockerMachineName = 0;

router.use(function (req,res,next) {
  next();
});

router.get('/app', function(req,res){
  console.log(dockerMachineName);
  //res.send('Hello World!');
  childProcess.execSync('docker-machine create --driver virtualbox --virtualbox-cpu-count -1'+' '+ dockerMachineName.toString());
  childProcess.execSync('eval $(docker-machine env '+ dockerMachineName.toString() + ')');
  childProcess.execSync('docker build -t irina/docker-nginx .');
  childProcess.execSync('docker run docker-nginx');

  dockerMachineName++
  console.log(dockerMachineName)
  res.send(dockerMachineName.toString());
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})