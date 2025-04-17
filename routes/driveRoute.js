const { Router, application } = require("express")
const multer = require("multer");
const driveRoute = Router();
const driveController = require("../controllers/driveController");
const { isAuth } = require("../authentication/authMiddleware")

//store uploaded files in memory
const storage = multer.memoryStorage();

//initialize multer with the storage configuration
const upload = multer({ storage: storage });

driveRoute.use(isAuth)

//render home page
driveRoute.get("/", driveController.getDrive);

//render specific folder in home page
driveRoute.get("/:id/folder", driveController.getDrive);

//add folder
driveRoute.post("/add-folder", driveController.postCreateFolder);

//add child folder
driveRoute.post("/:id/child-folder", driveController.postChildFolder);

//upload a file with parent folder
driveRoute.post("/:id/upload-file", upload.single("file"), driveController.postFileInFolder);

//upload file with no parent folder
driveRoute.post("/upload-file", upload.single("file"), driveController.postFile);

//delete file
driveRoute.post("/:id/delete-file", driveController.deleteFile);

//delete folder
driveRoute.post("/:id/delete-folder", driveController.deleteFolder);


module.exports = driveRoute;

