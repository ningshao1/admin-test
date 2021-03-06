const cfg = require("../config").cfg,
    os = require("os");

exports.renderTemp = (res, templateURL, data = {}) => {
    if (!res) {
        throw error("请传入响应参数");
        return;
    }
    let TemplateData = {
        cfg_webname: cfg.name,
        cfg_jquery: cfg.jquery,
        ...data
    };
    res.render(templateURL, TemplateData);
};
exports.res = (res, desc, data = null, code = 0) => {
    let ResData = {
        code: code,
        desc: desc,
        data: data
    };
    res.send(ResData);
};
(exports.selfAdd = () => {}),
(exports.Dateformat = time => {
    return (
        time.getFullYear() +
        "-" +
        (time.getMonth() + 1) +
        "-" +
        time.getUTCDay() +
        " " +
        time.getHours() +
        ":" +
        time.getMinutes() +
        ":" +
        time.getSeconds()
    );
});
exports.getIp = function () {
    const IP = os.networkInterfaces();
    for (key in IP) {
        if (IP[key] instanceof Array) {
            let address = "";
            IP[key].map(alias => {
                if (
                    alias.family === "IPv4" &&
                    alias.address !== "127.0.0.1" &&
                    !alias.internal
                ) {
                    address = alias.address;
                }
            });
            return address;
        }
    }
};