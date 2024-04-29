import { FileArray } from 'express-fileupload';
import fs from 'fs-extra';

import imageManager from '@managers/image.manager';

interface Image {
  url: string;
  public_id: string;
}

interface GetImagesURLParams {
  files?: FileArray | null;
  path: string;
}

const { uploadImage } = imageManager();

async function getImagesURL({ files, path }: GetImagesURLParams): Promise<Image[]> {
  let imageUrls: Image[] = [];

  if (files && Object.keys(files).length) {
    for (const file of Object.values(files)) {
      const images = Array.isArray(file) ? file : [file];

      const imageUploadPromises = images.map(async (image) => {
        const result = await uploadImage(image.tempFilePath, path);
        await fs.unlink(image.tempFilePath);
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      });

      const keyImageUrls = await Promise.all(imageUploadPromises);
      imageUrls = imageUrls.concat(keyImageUrls);
    }
  }

  return imageUrls;
}

export default getImagesURL;
