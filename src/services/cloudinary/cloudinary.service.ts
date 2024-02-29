import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(filePath: string, folder: string) {
  return await cloudinary.uploader.upload(filePath, { folder });
}

export async function deleteImage(id: string) {
  return await cloudinary.uploader.destroy(id);
}
