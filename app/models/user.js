var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    id: ObjectId,
    phone_number: String
});

var User = mongoose.model("User", UserSchema);

module.exports = {
  create: User
};
