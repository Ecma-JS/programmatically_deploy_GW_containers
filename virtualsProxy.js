const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://user:q1q1@cluster0-fqcrd.gcp.mongodb.net/test?retryWrites=true&w=majority';

class VirtualsProxy {
  constructor () {
    this.schema = mongoose.Schema({
      payload: Number
    })
  }

  async connect() {
    await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      })
      .then(() => console.log('DB Connected!'))
      .catch(err => {
      console.log('DB Connection Error:', err.message)});
      
  }

  create (payload) {
    this.Machine = mongoose.model('Machine', this.schema);
    this.machine = new this.Machine({ payload: payload });
  }

  save () {
    this.machine.save((err) => { 
      if (err) return console.error(err) 
      else console.log('document create')})
  }
}

// (async function () {
//   const proxy = new VirtualsProxy();
//   await proxy.connect()
//   proxy.create(16, 'stdout...')
//   proxy.save();

// })().catch((err) => {
//   console.log(err)
// })
module.exports = VirtualsProxy;
