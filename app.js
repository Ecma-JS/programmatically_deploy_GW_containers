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
  res.send(dockerMachineName.toString());

  childProcess.exec('bash script ' + dockerMachineName);
  
  dockerMachineName++;
  
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})