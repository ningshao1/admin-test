const cfg = require("../config")
    .cfg;
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
exports.selfAdd = () => {},
    exports.Dateformat = (time) => {
        return time.getFullYear() + '-' +
            (time.getMonth() + 1) + '-' +
            (time.getUTCDay()) + ' ' +
            time.getHours() + ':' +
            time.getMinutes() + ':' +
            time.getSeconds();
    }