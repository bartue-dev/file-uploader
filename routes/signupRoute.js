const { Router } = require("express");
const signupRoute = Router();

const signupController = require("../controllers/signupController");

signupRoute.get("/", signupController.getSignup);

signupRoute.post("/", signupController.postSignup);

module.exports = signupRoute;