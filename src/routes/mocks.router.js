const { Router } = require("express");
const mocksController = require("../controllers/mocks.controller")
const router = Router();


router.get('/',mocksController.getMockProducts)

module.exports = router