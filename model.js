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
exports.users = mongoose.model("user", userSchema);
//dataClass 模型
var dataClass = new mongoose.Schema({
    id: Number,
    name: String,
    sort: Number,
    type: Number
}, {
    versionKey: false
});
exports.dataClass = mongoose.model("dataclass", dataClass, "dataclass");
var counts = new mongoose.Schema({
    _id: String,
    number: Number
})
counts.statics = {
    addNumber(id, cb) {
        console.log(this.findOneAndUpdate())
        this.findOneAndUpdate({
            query: {
                _id: id
            },
            update: {
                $inc: {
                    number: 1
                }
            },
            function (err, data) {
                console.log(err)
                console.log(data)
            }
        })
    }

}
exports.count = mongoose.model('couter', counts)