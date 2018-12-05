const axios = require("axios");
const mongoose = require("mongoose");
mongoose.connect(
  `mongodb://106.14.124.207:27017/TEST_NAME`, {
    useNewUrlParser: true
  }
);
axios
  .get(
    `http://localhost:8000/admin/ajax_data_list?type=1&random=0.519396737915049`, {
      headers: {
        Cookie: "express:sess=eyJzZXNzX2FkbWluIjp7Im5hbWUiOiJhZG1pbiIsInB3ZCI6IjIxMjMyZjI5N2E1N2E1YTc0Mzg5NGEwZTRhODAxZmMzIiwiYWRkX3RpbWUiOjB9fQ==; express:sess.sig=PFjVLRomrWDIpJ859gIZm9HN2LI"
      }
    }
  )
  .then(data => {
    console.log(data);
    data.data.data.list.map(v => {
      delete v["dataclass"];
    });
    mongoose
      .model(
        "data",
        new mongoose.Schema({
          add_time: Date,
          content: String,
          dataclass_id: Number,
          hits: Number,
          id: Number,
          name: String,
          picture: String,
          sort: Number,
          type: Number
        }, {
          versionKey: false,
          autoIndex: true
        })
      ).insertMany(data.data.data.list);

    //var Tank = Mongoose.model('Tank', yourSchema);var small = new Tank({ size: 'small' });
  });