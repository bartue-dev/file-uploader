const asyncHandler = require("express-async-handler");
const db = require("../db/queries");


exports.getHome = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const paramsId = req.params.id
  
  const folders = await db.folderMethod.allFolder(id)
  let childFolder;
  let folder;
  
  if (paramsId) {
    folder = await db.folderMethod.toFolderPage(Number(paramsId));
    childFolder = await db.folderMethod.childFolder(Number(paramsId));
  }

  console.log("folder: ", folder);
  

  res.render("home", {
    title: "Home",
    folders: folders || [],
    folder: folder || [],
    childFolder: childFolder || []
  });
});

exports.postCreateFolder = asyncHandler(async (req, res, next) => {
  const { folderName } = req.body;
  const { id } = req.user;

  await db.folderMethod.addFolder(id, folderName);

  res.redirect("/home")

});

exports.postChildFolder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { folderName } = req.body

  await db.folderMethod.addChildFolder(Number(id), folderName);

  res.redirect(`/home/${id}/folder`)
});
