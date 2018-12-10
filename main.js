const express = require("express");
const config = require("./config");
const route = require("./route");

const { exec } = require("child_process");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
var MongoStore = require("connect-mongo")(session);
mongoose.connect(
    `mongodb://106.14.124.207:27017/TEST_NAME`, {
        useNewUrlParser: true
    }
);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.set("views", __dirname + "\\views");
app.use(
    session({
        //传入中间件函数，参数是一个对象
        secret: "123456",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        },
        rolling: true,
        store: new MongoStore({
            url: "mongodb://106.14.124.207:27017/TEST_NAME"
        })
    })
);
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(__dirname + "\\static"));
app.use(route);
app.disable("view cache");
const server = app.listen(config.cfg.port, "0.0.0.0", () => {
    const url = `http://${server.address().address}:${
    server.address().port
  }/admin/index`;
    switch (process.platform) {
        //mac系统使用 一下命令打开url在浏览器
    case "darwin":
        exec(`open ${url}`);
        break;
        //win系统使用 一下命令打开url在浏览器
    case "win32":
        exec(`start ${url}`);
        break;
        // 默认win系统
    default:
        exec(`start ${url}`);
    }
});