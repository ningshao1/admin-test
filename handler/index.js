const common = require("../common");
const model = require("../model.js");
const os = require("os");
const cfg = require("../config");
exports.index = (req, res) => {
    if (req.session.userInfo) {
        res.redirect("/admin/admin");
        return;
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

        common.renderTemp(res, "admin/admin.html", res_data);
    }
    else res.redirect("/admin/index");
};
exports.logout = (req, res) => {
    req.session.destroy(() => {
        // common.res(res,'获取成功', '退出成功', null, 1);
        res.redirect("/admin/index");
    });
};
exports.menuList = (req, res) => {
    common.res(res, "获取数据成功", cfg.ADMIN_MENU_LIST);
};
exports.dataClassList = (req, res) => {
    let type = 1;
    if (req.query.type) {
        type = parseInt(req.query.type);
    }
    model.dataClass
        .find({
            type
        })
        .exec((err, data) => {
            common.res(res, "获取数据成功", data);
        });
};
exports.dataClassAdd = (req, res) => {
    let id = req.query.id || 0;
    if (req.query.id) {}
    else {
        model.count.addNumber("dataClassId", (err, data) => {
            if (err) {
                return;
            }
            const options = {
                name: req.query.name,
                sort: parseInt(req.query.sort),
                type: parseInt(req.query.type),
                id: data.number
            };
            model.dataClass.create(options, (err, data) => {
                console.log(err);
                console.log(data);
                common.res(res, "添加成功");
            });
        });
    }
};
exports.dataClassGet = (req, res) => {
    model.dataClass
        .findOne({
            id: req.query.id
        })
        .exec((error, data) => {
            if (error) {
                return;
            }
            common.res(res, "获取成功", data);
        });
};

exports.dataListGet = (req, res) => {
    model.dataLists.queryLimit(res, (err, data) => {
        if (err) {
            return
        }
        else {
            let index = 0;
            model.dataLists.estimatedDocumentCount({
                type: req.query.type
            }, (err, total) => {

                const options = {
                    page: 1,
                    page_count: 1,
                    page_size: 10,
                    total: total
                }
                queryDataClass(res, data, options);

            })


        }
    })
}
let dataListIndex = 0;

function queryDataClass(res, data, options) {
    if (data.length === 0) {
        common.res(res, '获取成功', options)
        return
    }
    else if (data.length < dataListIndex + 1) {
        dataListIndex = 0;
        options["list"] = data;
        common.res(res, '获取成功', options)
    }
    else {
        const time = new Date(data[dataListIndex]['_doc']['add_time']);
        data[dataListIndex]['_doc']['add_time'] = common.Dateformat(time)
        model.dataClass.findOne({
            id: data[dataListIndex].dataclass_id
        }, (err, dataClassRow) => {
            if (err) {
                data[dataListIndex]['_doc']['dataclass'] = null;
            }
            else {
                data[dataListIndex]['_doc']['dataclass'] = dataClassRow;
            }
            ++dataListIndex

            queryDataClass(res, data, options)
        })
    }
}
exports.dataListRowHandler = (req, res) => {
    model.dataLists.findOne({
        id: req.query.id
    }, (err, data) => {
        model.dataClass.findOne({
            id: data.dataclass_id
        }, (err, classDta) => {
            if (err) {
                return
            }
            data._doc['dataclass'] = classDta;
            common.res(res, '获取成功', data)
        })
    })
}
exports.dataListAdd = (req, res) => {
    model.count.addNumber('dataListId', (err, {
        number
    }) => {

        model.dataLists.create({
            id: number,
            ...req.body,
            hits: 0,
            random: undefined
        }, (error, listData) => {
            if (error) return
            common.res(res, '添加成功')
        });

    })
}
exports.single = (req, res) => {
    model.singles.findOne({ id: req.query.id }, (err, data) => {
        common.res(res, '获取成功', data)

    })
}
exports.singleUpdate = () => {

}