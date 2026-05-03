import { prisma } from '../lib/prisma.js';

function showCreateFolderForm(req, res) {
  res.render('folders/create');
}

async function postCreateFolder(req, res, next) {
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
    next(error);
  }
}

async function listFolders(req, res, next) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
    });

    res.render('folders/index', { folders });
  } catch (error) {
    next(error);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).render('errorPage', {
        message: "Sorry! Folder doesn't exist",
      });
    }

    //check if the folder to be deleted belongs to that user
    // 403 -> resource exist, you don't have permission to access it
    if (folder.userId !== req.user.id) {
      return res.status(403).render('errorPage', {
        message: 'Insufficient Permission',
      });
    }

    //delete folder after verifyig that it belongs to that user
    await prisma.folder.delete({
      where: { id: folderId },
    });

    res.redirect('/folders');
  } catch (error) {
    next(error);
  }
}

async function showEditFolderForm(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).render('errorPage', {
        message: "Sorry! Folder doesn't exist",
      });
    }

    //before rendering edit form of folder, check if that folder belongs to user
    if (folder.userId !== req.user.id) {
      return res.status(403).render('errorPage', {
        message: 'Insufficient Permission',
      });
    }

    res.render('folders/edit', { folder });
  } catch (error) {
    next(error);
  }
}

async function editFolder(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);
    const { folderName } = req.body;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).render('errorPage', {
        message: "Sorry! Folder doesn't exist",
      });
    }

    //check if the folder to be edited belongs to that user
    if (folder.userId !== req.user.id) {
      return res.status(403).render('errorPage', {
        message: 'Insufficient Permission',
      });
    }

    await prisma.folder.update({
      where: { id: folderId },
      data: { name: folderName },
    });

    res.redirect('/folders');
  } catch (error) {
    next(error);
  }
}

async function showFolderById(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    if (!folder) {
      return res.status(404).render('errorPage', {
        message: "Sorry! Folder doesn't exist",
      });
    }

    //before showing folder, make sure it must belongs to that user
    if (folder.userId !== req.user.id) {
      return res.status(403).render('errorPage', {
        message: 'Insufficient Permission',
      });
    }

    res.render('folders/show', { folder });
  } catch (error) {
    next(error);
  }
}

export {
  showCreateFolderForm,
  postCreateFolder,
  listFolders,
  deleteFolder,
  showEditFolderForm,
  editFolder,
  showFolderById,
};
