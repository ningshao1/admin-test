const express = require("express");
const router = express.Router();
const handler = require("../handler");
router.get("/admin/index", handler.index);
router.get(`/admin/ajax_login`, handler.login);
router.get(`/admin/admin`, handler.admin);
module.exports = router;