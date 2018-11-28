const common = require("../common");
const model = require("../model.js");
exports.index = (req, res) => {
    if (req.session.userInfo) {
        res.redirect('/admin/admin');
        return
    }
    common.renderTemp(res, "admin/index.html");
};
exports.login = (req, res) => {

    model.users.findUser({
            user_name: req.query.name,
            pwd: req.query.pwd
        },
        (error, data) => {
            if (error) {
                console.log("查询错误");
                return;
            }
            if (!data) {
                common.res(res, "账号或密码错误", null, 1);
                return;
            }
            req.session.userInfo = data;
            common.res(res, "登录成功", null, 0);
        }
    );
};
exports.admin = (req, res) => {
    if (req.session.userInfo)
        res.send(`管理页面`);
    else res.redirect('/admin/index')
};