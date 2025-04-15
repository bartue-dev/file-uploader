const asyncHandler = require("express-async-handler");
const { supabase } = require("../storage/supabase");
const { decode } = require("base64-arraybuffer");
const { deleteHelper } = require("./helper");
const db = require("../db/queries");

//render home page along with the datas
exports.getHome = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const paramsId = req.params.id
  
  const mainFolderAndFile = await db.folderMethod.mainFolderAndFile(id)
  let folder;
  
  if (paramsId) {
    folder = await db.folderMethod.toFolderPage(Number(paramsId));
  }

  // console.log("FOLDER:", folder)
  // console.log("FOLDERS&FILES:", mainFolderAndFile[0].file);
  

  res.render("home", {
    title: "Home",
    mainFolderAndFile: mainFolderAndFile[0] || [],
    folder: folder,
  });
});

//create folder
exports.postCreateFolder = asyncHandler(async (req, res, next) => {
  const { folderName } = req.body;
  const userId = req.user.id;

  await db.folderMethod.addFolder(userId, folderName);

  res.redirect("/home");

});

//create child folder
exports.postChildFolder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { folderName } = req.body
  const userId = req.user.id;

  await db.folderMethod.addChildFolder(Number(id), folderName, userId);

  res.redirect(`/home/${id}/folder`)
});

//create file
exports.postFileInFolder = asyncHandler(async (req, res, next) => {
  const {originalname, buffer, mimetype} = req.file;
  const userId = req.user.id;
  const folderId = Number(req.params.id); 

  if (!req.file) {
    res.status(400).json({message: "Please upload file"})
  }

  const filePath = `${userId}/${folderId}/${originalname}`;
  const fileBase64 = decode(buffer.toString("base64"));

  const { data, error } = await supabase.storage
  .from("files")
  .upload(filePath, fileBase64, {
    contentType: mimetype
  });

  if (error) {
    console.error("Supabase upload error:", error);
    return res.status(500).json({
      message: "Failed to upload file to Supabase",
      error: error
    });
  }

  // console.log("Upload successful:", data);

  const result = supabase.storage
    .from("files")
    .getPublicUrl(filePath)

  const publicUrl = result.data.publicUrl;

  await db.fileMethod.addFile({
    authorId: userId,
    folderId: folderId,
    name: originalname,
    url: publicUrl,
    type: mimetype 
  });


  // console.log("File url", publicUrl)

  res.redirect(`/home/${folderId}/folder`);
});

//upload file without a folder
exports.postFile = asyncHandler(async (req, res, next) => {
  const { originalname, buffer, mimetype} = req.file;
  const userId = req.user.id;

 if (!req.file) {
    res.status(400).json({message: "Please upload file"})
  }

  const filePath = `${userId}/${originalname}`;
  const fileBase64 = decode(buffer.toString("base64"));

  const { data, error } = await supabase.storage
  .from("files")
  .upload(filePath, fileBase64, {
    contentType: mimetype
  });

  if (error) {
    console.error("Supabase upload error:", error);
    return res.status(500).json({
      message: "Failed to upload file to Supabase",
      error: error
    });
  }

  // console.log("Upload successful:", data);


  const { data: urlData } = supabase.storage
    .from("files")
    .getPublicUrl(filePath)

  const publicUrl = urlData.publicUrl;

  await db.fileMethod.addFile({
    authorId: userId,
    name: originalname,
    url: publicUrl,
    type: mimetype,
    authorId: userId
  });

  // console.log("File url", publicUrl)

  res.redirect("/home");
});

//delete file
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const fileId = req.params.id

  const file = await db.fileMethod.getFileById(Number(fileId));

  
  const url = file.url.split("/public/files/");
  
  const filePath = url[1].replace(/%20/g, " ");;

  const { error: deleteError } = await supabase.storage
    .from("files")
    .remove([filePath]);

    if (deleteError) {
      console.error("Error deleting file from storage:", deleteError);
      return res.status(500).json({ 
        message: "Failed to delete file from storage",
        error: deleteError
      });
    }

  await db.fileMethod.deleteFile(Number(fileId));

  res.redirect("/home")

});

//delete folder
exports.deleteFolder = asyncHandler(async (req, res, next) => {
  const folderId = req.params.id;
  
  deleteHelper(Number(folderId));

  res.redirect("/home")

});


