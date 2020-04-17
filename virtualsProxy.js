const mongoose = require('mongoose');
const machineProxy = require('./VirtualProxyStent');

const MONGO_URI = 'mongodb+srv://user:q1q1@cluster0-fqcrd.gcp.mongodb.net/test?retryWrites=true&w=majority';

class VirtualsProxy {
  
  constructor () {
    this.schema = mongoose.Schema({
      name:String,
      payload: Array
    });
    this.connection = null;
  }

  connect() {
    machineProxy.connectToMongo()
    return new Promise ((res,rej) => { 
      if (this.connection == null) {
        this.connection = mongoose.connect(MONGO_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useFindAndModify: false
          })
          .then(() => {
            machineProxy.success();
            console.log('DB Connected!')
            this.model = mongoose.model('Machine', this.schema);
            res();
          }) .catch(err => {
            machineProxy.failed();
            rej(err)
          console.log('DB Connection Error:', err.message)});
      }  else res();
    })
  }

  create(name) {
    machineProxy.create();
    return new this.model({ name: name, payload:[] });
  }

  findAndUpdate(machine, data) {
    machineProxy.update();
    return new Promise ((res, rej) => {
      const update = machine.payload.push(data);
      this.model.findOneAndUpdate(machine.name, {payload: update}, (err, doc) => {
        if (err) {
          machineProxy.failed()
          rej(err)
        }
        else {
          res(doc)
          machineProxy.success();
        }
      })
    })

  }

  save (machine) {
    machineProxy.save();
    return new Promise ((res, rej) => {
      machine.save((err) => { 
        if (err) {
          machineProxy.failed(); 
          rej(err)
        }
        else {
          console.log('document create')
          machineProxy.success();
          res();
        }
      })
    })
  }
}

module.exports = VirtualsProxy;
