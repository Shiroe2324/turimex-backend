import { v2 as cloudinary } from 'cloudinary';
import config from '../../utils/config';

cloudinary.config({
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  cloud_name: config.cloudinary.cloudName,
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
