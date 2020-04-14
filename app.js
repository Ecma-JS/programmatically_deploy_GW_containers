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
  childProcess.exec('docker-machine create --driver virtualbox --virtualbox-cpu-count -1 '+ dockerMachineName, (err, stdout) => {
    console.log(stdout);
    const req = 'eval $(docker-machine env ' + dockerMachineName + ')';
    console.log(req)
    childProcess.exec(req,  (err, stdout, stderr) => {
      childProcess.exec('docker-machine active', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        childProcess.exec('docker build -t irina/docker-nginx .', (err, stdout) => {
          console.log(stdout);
          childProcess.exec('docker run --publish=80:80 irina/docker-nginx', (err, stdout, stderr) => {
            dockerMachineName++
          });
        });
      })

    });
  });


  res.send(dockerMachineName.toString());
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})