const { Router } = require("express");
const indexRoute = Router();

const indexController = require("../controllers/indexController");

indexRoute.get("/", indexController.getIndex);


module.exports = indexRoute;