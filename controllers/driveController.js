const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { supabase } = require("../storage/supabase");
const { decode } = require("base64-arraybuffer");
const { deleteHelper } = require("./helper");
const { validationResult } = require("express-validator");
const { validateCreateFile, validateCreateFolder } = require("../validator/express-validator")

//render drive page along with the datas
exports.getDrive = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const paramsId = req.params.id
  
  const mainFolderAndFile = await db.folderMethod.mainFolderAndFile(id)
  let folder;
  
  if (paramsId) {
    folder = await db.folderMethod.toFolderPage(Number(paramsId));
  }

  // console.log("FOLDER:", folder)
  // console.log("FOLDERS&FILES:", mainFolderAndFile[0].file);
  

  res.render("drive", {
    title: "Drive",
    mainFolderAndFile: mainFolderAndFile[0] || [],
    folder: folder,
  });
});

//create folder
exports.postCreateFolder = [validateCreateFolder ,asyncHandler(async (req, res, next) => {

  const errors = validationResult(req);
  const { folderName } = req.body;
  const userId = req.user.id;

  if (!errors.isEmpty()) {
    return res.render("ErrorPage", {
      errors: errors.array()
    });
  }

  await db.folderMethod.addFolder(userId, folderName);

  res.redirect("/drive");

})];

//create child folder
exports.postChildFolder = [validateCreateFolder ,asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  const { id } = req.params;
  const { folderName } = req.body
  const userId = req.user.id;

  if (!errors.isEmpty()) {
    return res.render("ErrorPage", {
      errors: errors.array()
    });
  }

  await db.folderMethod.addChildFolder(Number(id), folderName, userId);

  res.redirect(`/drive/${id}/folder`)
})];

//create file in a folder
exports.postFileInFolder = [validateCreateFile, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("ErrorPage", {
      errors: errors.array()
    })
  }

  const {originalname, buffer, mimetype} = req.file;
  const userId = req.user.id;
  const folderId = Number(req.params.id); 

  if (!req.file) {
    res.status(400).json({message: "Please upload file"})
  }

  const filePath = `${userId}/${folderId}/${originalname}`;
  const fileBase64 = decode(buffer.toString("base64"));

  const { error } = await supabase.storage
  .from("files")
  .upload(filePath, fileBase64, {
    contentType: mimetype
  });
  
  if (error) {
    console.error("Supabase upload error:", error.message);
    return res.render("ErrorPage", {
      cloudErr: error,
      errors: []
    })
  }

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

  res.redirect(`/drive/${folderId}/folder`);
})];

//upload file without a folder
exports.postFile = [validateCreateFile, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  const userId = req.user.id;
  
  if (!errors.isEmpty()) {
    return res.render("ErrorPage", {
      errors: errors.array()
    });
  }
  
const { originalname, buffer, mimetype} = req.file;

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
    return res.render("ErrorPage", {
      cloudErr: error,
      errors: []
    })
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

  res.redirect("/drive");
})];

//delete file
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const fileId = req.params.id

  console.log("FILE ID: ", fileId);
  

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

  res.redirect("/drive")

});

//delete folder
exports.deleteFolder = asyncHandler(async (req, res, next) => {
  const folderId = req.params.id;
  
  deleteHelper(Number(folderId));

  res.redirect("/drive")

});

