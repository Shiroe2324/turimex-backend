import mongodbProductManager from '../databases/mongodb/managers/product';

function productManager() {
  return { ...mongodbProductManager() };
}

export default productManager;
