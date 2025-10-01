const express = require("express");
const router = express.Router();
const { zuperrController } = require("../controller/zuperr.controller");

router.post("/welcome", zuperrController);

module.exports = router;
