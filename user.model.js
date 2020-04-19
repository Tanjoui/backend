const mongoose = require('mongoose');
const Schema = mongoose.Schema

let User = new Schema({
  userid: {type: String},
  username: {type: String},
  userpass: {type: String}
});

module.exports = mongoose.model('User', User);
