const { supabase } = require("../storage/supabase");
const db = require("../db/queries");

async function deleteHelper(folderId) {
  try {
    
    if (folderId) {

    const childFolders = await db.folderMethod.getChildFolder(folderId);
    
    //recursion deletion to delete childFolders and all files associated with it
    for ( const folders of childFolders) {
      await deleteHelper(folders.id);
    }
    
    const files = await db.fileMethod.getFileByFolderId(folderId);

    for (const file of files) {
      const url = file.url.split("/public/files/");
      const filePath = url[1].replace(/%20/g, " ");

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
    }

      await db.fileMethod.deleteFileByFolder(folderId);
      await db.folderMethod.deleteFolder(folderId);

    }


  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  deleteHelper
}