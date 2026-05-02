import { prisma } from '../lib/prisma.js';

function showCreateFolderForm(req, res) {
  res.render('folders/create');
}

async function postCreateFolder(req, res) {
  const { folderName } = req.body;
  try {
    await prisma.folder.create({
      data: {
        name: folderName,
        userId: req.user.id,
      },
    });
    res.redirect('/folders');
  } catch (error) {
    console.error(error);
  }
}

async function listFolders(req, res) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
    });

    res.render('folders/index', { folders });
  } catch (error) {
    console.error(error);
  }
}

async function deleteFolder(req, res) {
  try {
    const folderId = parseInt(req.params.id);

    await prisma.folder.delete({
      where: { id: folderId },
    });

    res.redirect('/folders');
  } catch (error) {
    console.error(error);
  }
}

async function showEditFolderForm(req, res) {
  const folderId = parseInt(req.params.id);
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });
  res.render('folders/edit', { folder });
}

async function editFolder(req, res) {
  try {
    const folderId = parseInt(req.params.id);
    const { folderName } = req.body;

    await prisma.folder.update({
      where: { id: folderId },
      data: { name: folderName },
    });

    res.redirect('/folders');
  } catch (error) {
    console.error(error);
  }
}

export {
  showCreateFolderForm,
  postCreateFolder,
  listFolders,
  deleteFolder,
  showEditFolderForm,
  editFolder,
};
