const { Router } = require("express")
const multer = require("multer");
const homeRoute = Router();
const homeController = require("../controllers/homeController");

//store uploaded files in memory
const storage = multer.memoryStorage();

//initialize multer with the storage configuration
const upload = multer({ storage: storage });

//render home page
homeRoute.get("/", homeController.getHome);

//render specific folder in home page
homeRoute.get("/:id/folder", homeController.getHome);

//add folder
homeRoute.post("/add-folder", homeController.postCreateFolder);

//add child folder
homeRoute.post("/:id/child-folder", homeController.postChildFolder);

//upload a file with parent folder
homeRoute.post("/:id/upload-file", upload.single("file"), homeController.postFileInFolder);

//upload file with no parent folder
homeRoute.post("/upload-file", upload.single("file"), homeController.postFile);

//delete file
homeRoute.post("/:id/delete-file", homeController.deleteFile);


module.exports = homeRoute;

