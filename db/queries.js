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

  async allFolder(userId) {
    const folders = await prisma.folder.findMany({
      where: {
        AND: [
        { authorId: userId },
        { parentFolderId: null }          
        ]
      }
    });
    return folders;
  }

  async toFolderPage(id) {
    const folder = await prisma.folder.findUnique({
      where: {
        id: id
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

  async childFolder(Id) {
    const childFolder = await prisma.folder.findUnique({
      where: {id: Id},
      include: {
        childFolder: true
      }
    });

    return childFolder;
  }

}

const folderMethod = new Folder();

module.exports = {
  folderMethod
}