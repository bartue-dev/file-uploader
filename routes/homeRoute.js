const { Router } = require("express")
const multer = require("multer");
const homeRoute = Router();
const homeController = require("../controllers/homeController");

//store uploaded files in memory
const storage = multer.memoryStorage();

//initialize multer with the storage configuration
const upload = multer({ storage: storage });

//
homeRoute.get("/", homeController.getHome);

//
homeRoute.post("/add-folder", homeController.postCreateFolder);

//
homeRoute.get("/:id/folder", homeController.getHome);

//
homeRoute.post("/:id/child-folder", homeController.postChildFolder);

//
homeRoute.post("/:id/upload-file", upload.single("file"), homeController.postFileInFolder);

//
homeRoute.post("/upload-file", upload.single("file"), homeController.postFile);


module.exports = homeRoute;

