const express = require("express");
const config = require("./config");
const route = require("./route");

const {
    exec
} = require("child_process");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session')
mongoose.connect(`mongodb://127.0.0.1:27017/TEST_NAME`, {
    useNewUrlParser: true
});
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.set("views", "views");

app.use(session({ //传入中间件函数，参数是一个对象
    secret: '123456',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true
    },
    rolling: true
}));
app.use(express.static("static"));
app.use(route);
app.disable('view cache');
const server = app.listen(config.cfg.port, "127.0.0.1", () => {
    const url = `http://${server.address().address}:${server.address().port}/admin/index`
    return;
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