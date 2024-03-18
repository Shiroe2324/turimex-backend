import cloudinaryImageManager from '../services/cloudinary/cloudinary.service';

function manageImages() {
  return { ...cloudinaryImageManager() };
}

export default manageImages;
