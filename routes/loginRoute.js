const { Router } = require("express");
const loginRoute = Router();
const loginController = require("../controllers/loginController");

loginRoute.get("/", loginController.getLogin);


module.exports = loginRoute;