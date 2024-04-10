import { UploadedFile } from 'express-fileupload';
import { CustomValidator } from 'express-validator';

function verifyImageFile(file: UploadedFile) {
  if (!file.mimetype.startsWith('image/')) {
    throw new Error('All files must be images.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('All files must not exceed 5 MB.');
  }
}

const validateImageFile: CustomValidator = (_, { req }) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new Error('No files have been selected.');
  }

  for (const file of Object.values(req.files)) {
    const uploadedFile = file as UploadedFile | UploadedFile[];

    if (Array.isArray(uploadedFile)) {
      uploadedFile.forEach(verifyImageFile);
    } else {
      verifyImageFile(uploadedFile);
    }
  }

  return true;
};

export default validateImageFile;
