const mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    user_name: String,
    pwd: String,
    add_time: { type: Date, default: new Date() },
    id: Number
}, {
    versionKey: false
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
exports.dataClass = mongoose.model("dataClass", dataClass, "dataClass");
var counts = new mongoose.Schema({
    _id: String,
    number: Number
});
counts.statics = {
    addNumber(id, cb) {
        this.findOneAndUpdate({
                _id: id
            }, {
                $inc: {
                    number: 1
                }
            }, {
                new: true
            },
            cb
        );
    }
};
exports.count = mongoose.model("couter", counts);

var dataList = new mongoose.Schema({
    add_time: {
        type: Date,
        default: new Date()
    },
    connect: String,
    dataclass_id: Number,
    hits: Number,
    id: {
        type: Number,
        required: true
    },
    name: String,
    picture: String,
    sort: Number,
    type: Number
}, {
    versionKey: false,
    autoIndex: true
});
dataList.statics = {
    queryLimit(cb) {
        this.find({})
            .skip(0)
            .limit(30)
            .sort({ sort: 1 })
            .exec(cb);
    }
};
exports.dataLists = mongoose.model("data", dataList);

var single = new mongoose.Schema({
    id: Number,
    content: String,
    name: String
});
exports.singles = mongoose.model("district", single);