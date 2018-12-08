const axios = require("axios");
const mongoose = require("mongoose");
mongoose.connect(
  `mongodb://106.14.124.207:27017/TEST_NAME`,
  {
    useNewUrlParser: true
  }
);
axios
  .get(
    `http://127.0.0.1:8000/admin/ajax_admin_list?random=0.7450246911556624`,
    {
      headers: {
        Cookie:
          "connect.sid=s%3AY4RhMrKAiWWy-zJh9jEeadEK52pN9-XH.6iaPVqYe0lltN8b4U0kdg20S8ZSKwK%2FQcWrgyPABQSM; express:sess=eyJzZXNzX2FkbWluIjp7Im5hbWUiOiJhZG1pbiIsInB3ZCI6IjIxMjMyZjI5N2E1N2E1YTc0Mzg5NGEwZTRhODAxZmMzIiwiYWRkX3RpbWUiOjB9fQ==; express:sess.sig=PFjVLRomrWDIpJ859gIZm9HN2LI"
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
        "user",
        new mongoose.Schema(
          {
            add_time: Date,
            id: Number,
            name: String,
            pwd: String
          },
          {
            versionKey: false,
            autoIndex: true
          }
        )
      )
      .insertMany(data.data.data.list);

    //var Tank = Mongoose.model('Tank', yourSchema);var small = new Tank({ size: 'small' });
  });
