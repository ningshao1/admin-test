const axios = require('axios');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/TEST_NAME`, {
    useNewUrlParser: true
})
axios.get(`http://localhost:8000/admin/ajax_dataclass_list?type=1&random=0.532099508944408`, {
    headers: {
        "Cookie": 'express:sess=eyJzZXNzX2FkbWluIjp7Im5hbWUiOiJhZG1pbiIsInB3ZCI6IjIxMjMyZjI5N2E1N2E1YTc0Mzg5NGEwZTRhODAxZmMzIiwiYWRkX3RpbWUiOjB9fQ==; express:sess.sig=PFjVLRomrWDIpJ859gIZm9HN2LI'
    }
}).then(({
    data: {
        data
    }
}) => {
    console.log(data)
    mongoose.model('dataClass', new mongoose.Schema({
        id: Number,
        name: String,
        sort: Number,
        type: Number
    }, {
        versionKey: false
    }), 'dataClass').insertMany(data);
    //var Tank = Mongoose.model('Tank', yourSchema);var small = new Tank({ size: 'small' });
})