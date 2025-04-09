const { Router } = require("express")
const homeRoute = Router();
const homeController = require("../controllers/homeController");


homeRoute.get("/", homeController.getHome);

homeRoute.post("/add-folder", homeController.postCreateFolder);

homeRoute.get("/:id/folder", homeController.getHome);

homeRoute.post("/:id/child-folder", homeController.postChildFolder);

module.exports = homeRoute;

