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
        common.res(res, "获取成功", "退出成功", null, 1);
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
    model.dataLists.queryLimit((err, data) => {
        if (err) {
            return;
        }
        else {
            let index = 0;
            model.dataLists.estimatedDocumentCount({
                    type: req.query.type
                },
                (err, total) => {
                    const options = {
                        page: 1,
                        page_count: 1,
                        page_size: 10,
                        total: total
                    };
                    queryDataClass(res, data, options);
                }
            );
        }
    });
};
let dataListIndex = 0;

function queryDataClass(res, data, options) {
    if (data.length === 0) {
        common.res(res, "获取成功", options);
        return;
    }
    else if (data.length < dataListIndex + 1) {
        dataListIndex = 0;
        options["list"] = data;
        common.res(res, "获取成功", options);
    }
    else {
        const time = new Date(data[dataListIndex]["_doc"]["add_time"]);
        data[dataListIndex]["_doc"]["add_time"] = common.Dateformat(time);
        model.dataClass.findOne({
                id: data[dataListIndex].dataclass_id
            },
            (err, dataClassRow) => {
                if (err) {
                    data[dataListIndex]["_doc"]["dataclass"] = null;
                }
                else {
                    data[dataListIndex]["_doc"]["dataclass"] = dataClassRow;
                }
                ++dataListIndex;

                queryDataClass(res, data, options);
            }
        );
    }
}
exports.dataListRowHandler = (req, res) => {
    model.dataLists.findOne({
            id: req.query.id
        },
        (err, data) => {
            model.dataClass.findOne({
                    id: data.dataclass_id
                },
                (err, classDta) => {
                    if (err) {
                        return;
                    }
                    data._doc["dataclass"] = classDta;
                    common.res(res, "获取成功", data);
                }
            );
        }
    );
};
exports.dataListAdd = (req, res) => {
    model.count.addNumber("dataListId", (err, { number }) => {
        model.dataLists.create({
                id: number,
                ...req.body,
                hits: 0,
                random: undefined
            },
            (error, listData) => {
                if (error) return;
                common.res(res, "添加成功");
            }
        );
    });
};
exports.single = (req, res) => {
    model.singles.findOne({ id: req.query.id }, (err, data) => {
        common.res(res, "获取成功", data);
    });
};
exports.singleUpdate = (req, res) => {
    model.singles.update({ id: req.body.id }, { $set: { content: req.body.content } },
        (err, data) => {
            common.res(res, "更新成功");
        }
    );
};
exports.updatepwd = (req, res) => {
    const info = req.query;
    if (info.old_pwd === req.session.userInfo.pwd) {
        if (info.pwd === info.pwd2) {
            model.users.update({ _id: req.session.userInfo._id }, { $set: { pwd: info.pwd } },
                (err, data) => {
                    if (err) {
                        return;
                    }
                    common.res(res, "修改成功");
                }
            );
        }
        else {
            common.res(res, "确认密码与新密码不同", null, 1);
        }
    }
    else {
        common.res(res, "旧密码输入错误", null, 1);
    }
};
exports.adminList = (req, res) => {
    model.users.find({}, (err, data) => {
        if (err) {
            return;
        }
        if (data instanceof Array) {
            data.map(v => {
                v["_doc"]["name"] = v["user_name"];
                v["_doc"]["add_time"] = common.Dateformat(v["_doc"]["add_time"]);
            });
        }
        const resData = {
            page: 1,
            page_count: 1,
            page_size: 16,
            total: 5,
            list: data
        };
        common.res(res, "获取成功", resData);
    });
};
exports.adminDel = (req, res) => {
    model.users.remove({ id: parseInt(req.query.id) }, (err, data) => {
        if (err) {
            return;
        }
        common.res(res, "删除成功");
    });
};
exports.adminAdd = (req, res) => {
    model.users.findOne({ user_name: req.query.name }, (err, data) => {
        if (data) {
            common.res(res, "账号已存在", null, 1);
        }
        else {
            adduser(req, res);
        }
    });
};

function adduser(req, res) {
    model.count.addNumber("userId", (err, data) => {
        const ID = data.number;
        if (req.query.pwd === req.query.pwd2) {
            model.users.create({
                    user_name: req.query.name,
                    pwd: req.query.pwd,
                    add_time: new Date(),
                    id: ID
                },
                () => {
                    common.res(res, "账号添加成功");
                }
            );
        }
        else {
            common.res(res, "确认密码错误", null, 1);
        }
    });
}