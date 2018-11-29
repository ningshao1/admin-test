const express = require("express");
const router = express.Router();
const handler = require("../handler");
router.all(`*`, (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    if (!req.session.userInfo && req.path !== '/admin/index' && req.path !== `/admin/ajax_login`) {
        res.redirect('/admin/index');
    } else {
        next();
    }
})
router.get("/admin/index", handler.index);
router.get(`/admin/ajax_login`, handler.login);
router.get(`/admin/admin`, handler.admin);
router.get(`/admin/ajax_menu_list`, handler.menuList)
router.get(`/admin/ajax_dataclass_list`, handler.dataClassList);
router.get(`/admin/ajax_logout`, handler.logout);
router.get(`/admin/ajax_dataclass_add`, handler.dataClassAdd);
router.get(`/admin/ajax_dataclass_get`,handler.dataClassGet)
module.exports = router;