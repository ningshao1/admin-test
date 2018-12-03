const mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
  user_name: String,
  pwd: String
});
userSchema.statics = {
  findUser(userInfo, cb) {
    this.findOne(userInfo).exec(cb);
  }
};
exports.users = mongoose.model("user", userSchema, "user");
//dataClass 模型
var dataClass = new mongoose.Schema(
  {
    id: Number,
    name: String,
    sort: Number,
    type: Number
  },
  {
    versionKey: false
  }
);
exports.dataClass = mongoose.model("dataClass", dataClass, "dataClass");
var counts = new mongoose.Schema({
  _id: String,
  number: Number
});
counts.statics = {
  addNumber(id, cb) {
    this.findOneAndUpdate(
      { _id: id },
      {
        $inc: {
          number: 1
        }
      },
      {
        new: true
      },
      cb
    );
  }
};
exports.count = mongoose.model("couter", counts);
