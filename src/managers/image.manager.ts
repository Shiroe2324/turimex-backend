import { deleteImage, uploadImage } from '../services/cloudinary/cloudinary.service';

function manageImages() {
  return {
    deleteImage,
    uploadImage,
  };
}

export default manageImages;
