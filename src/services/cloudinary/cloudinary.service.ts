import { v2 as cloudinary } from 'cloudinary';
import config from '../../utils/config';

cloudinary.config({
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  cloud_name: config.cloudinary.cloudName,
  secure: true,
});

export async function uploadImage(filePath: string, folder: string) {
  return await cloudinary.uploader.upload(filePath, { folder });
}

export async function deleteImage(id: string) {
  return await cloudinary.uploader.destroy(id);
}
