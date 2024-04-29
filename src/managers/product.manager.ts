import mongodbProductManager from '@mongodb/managers/product';

function productManager() {
  return { ...mongodbProductManager() };
}

export default productManager;
