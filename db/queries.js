const { prisma } = require("./prisma");

class Folder {

  async addFolder(userId, folderName) {
    await prisma.folder.create({
      data: {
        name: folderName,
        author: {
          connect: {
            id: userId
          }
        }
      }
    });
  }

  async mainFolderAndFile(userId) {
    const folders = await prisma.user.findMany({
      where: {
        id: userId
      }, 
      include: {
        folder: {
          where: {
            AND: [
              { authorId: userId },
              { parentFolderId: null }          
              ]
          }
        },
        file: {
          where: {
            folderId: null
          }
        }
      }
    });
    return folders;
  }

  async toFolderPage(id) {
    const folder = await prisma.folder.findUnique({
      where: {
        id: id
      },
      include: {
        childFolder: true,
        file: true
      }
    });

    return folder
  }

  async addChildFolder(folderId, name, userId) {
    await prisma.folder.create({
      data: {
        name: name,
        parentFolderId: folderId,
        authorId: userId
      }
    });
  }

  async getChildFolder(id) {
    const result = await prisma.folder.findMany({
      where: {
        parentFolderId: id
      }
    });

    return result;
  }

  async deleteFolder(id) {
    await prisma.folder.delete({
      where: {
        id: id
      }
    });
  }

}

class File {
  async addFile(fileData) {
    await prisma.file.create({
      data: fileData
    });
  }

  async getFileById(fileId) {
    const result = await prisma.file.findUnique({
      where: {
        id: fileId
      },
    });

    return result;
  }

  async getFileByFolderId(folderId) {
    const result = await prisma.file.findMany({
      where: {
        folderId: folderId
      }
    });

    return result;
  }

  async deleteFile(fileId) {
    await prisma.file.delete({
      where: {
        id: fileId
      }
    });
  }

  async deleteFileByFolder(folderId) {
    await prisma.file.deleteMany({
      where: {
        folderId: folderId
      }
    })
  }
}

const folderMethod = new Folder();
const fileMethod = new File();

module.exports = {
  folderMethod,
  fileMethod
}