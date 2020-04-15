const express = require('express');
const app = express();
const router = express.Router();
const childProcess = require('child_process');

const path = __dirname;
const port = 3000;
let dockerMachineName = -1;

router.use(function (req,res,next) {
  next();
});

router.get('/app', function(req,res){
  
  dockerMachineName++
  childProcess.exec('docker-machine create --driver virtualbox --virtualbox-cpu-count -1 '+ dockerMachineName, (err, stdout) => {
    console.log(stdout);
    childProcess.exec('bash build ' + dockerMachineName, (err, stdout, stderr) => {
      console.log(stdout)
      console.log(stderr)
      childProcess.exec('bash run ' + dockerMachineName)
    })
  });

  res.send(dockerMachineName.toString());
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})