import cloudinaryImageManager from '@cloudinary/cloudinary.service';

function imageManager() {
  return { ...cloudinaryImageManager() };
}

export default imageManager;
