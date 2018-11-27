const express = require("express");
const config = require("./config");
const route = require("./route");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(`mongodb://127.0.0.1:27017/TEST_NAME`);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("static"));
app.use(route);
const server = app.listen(config.cfg.port, "127.0.0.1", () => {
    console.log(`http://${server.address().address}:${server.address().port}`);
});
