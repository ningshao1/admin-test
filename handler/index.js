const common = require("../common");
const model = require("../model.js");
const os = require('os');
const cfg = require('../config')
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
    if (req.session.userInfo) {
        var res_data = {
            sys_type: os.type(),
            sys_ver: os.release(),
            server: process.argv0,
            sess_admin: req.session.userInfo
        };

        common.renderTemp(res, 'admin/admin.html', res_data);


    } else res.redirect('/admin/index')
};
exports.logout = (req, res) => {
    req.session.destroy(() => {
        // common.res(res, '退出成功', null, 1);
        res.redirect('/admin/index');
    })

}
exports.menuList = (req, res) => {
    common.res(res, '获取数据成功', cfg.ADMIN_MENU_LIST)
}
exports.dataClassList = (req, res) => {


}