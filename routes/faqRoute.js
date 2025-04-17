const {Router} = require("express");
const faqRoute = Router();
const faqController = require("../controllers/faqController");

faqRoute.get("/", faqController.getFaq);

module.exports = faqRoute