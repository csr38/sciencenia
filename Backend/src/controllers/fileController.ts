import { Request, Response } from 'express';
import { File } from '../db/models/file';
import { Multer } from 'multer';

const createFile = async (file: Multer.File) => {
  return await File.create({
    fileName: file.originalname,
    filePath: file.path || file.location,
    mimeType: file.mimetype,
    url: file.path || file.location,
    key: file.key || file.filename,
    size: file.size,
  });
}

const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = await createFile(req.file);

    return res.status(200).json({ 
      message: 'File uploaded successfully', 
      fileId: file.id,
      file 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error uploading file' });
  }
};

const getFileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.status(200).json({ url: file.url, fileName: file.fileName, mimeType: file.mimeType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching file' });
  }
};

const deleteFileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    await file.destroy();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el archivo'});
  }
};

export default {
  createFile,
  uploadFile,
  getFileById,
  deleteFileById,
};
