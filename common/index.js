const cfg = require("../config").cfg;
exports.renderTemp = (res, templateURL, data) => {
  if (!res) {
    throw error("请传入响应参数");
    return;
  }
  let TemplateData = data || {
    cfg_webname: cfg.name,
    cfg_jquery: cfg.jquery
  };
  res.render(templateURL, TemplateData);
};
exports.res = (res, desc, data = "", code = 0) => {
  let ResData = {
    code: code,
    desc: desc,
    data: data
  };
  res.send(ResData);
};
