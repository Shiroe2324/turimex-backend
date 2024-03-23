import { v2 as cloudinary } from 'cloudinary';
import config from '../../utils/config';

const { cloudinary: cloudinaryConfig } = config;

cloudinary.config({
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
  cloud_name: cloudinaryConfig.cloudName,
  secure: true,
});

async function deleteImage(id: string) {
  return await cloudinary.uploader.destroy(id);
}

async function uploadImage(filePath: string, folder: string) {
  return await cloudinary.uploader.upload(filePath, { folder });
}

function imageManager() {
  return { deleteImage, uploadImage };
}

export default imageManager;
