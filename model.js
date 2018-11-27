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
