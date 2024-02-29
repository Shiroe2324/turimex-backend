import mongodbProductManager from '../databases/mongodb/managers/product';

function manageProducts() {
  return { ...mongodbProductManager() };
}

export default manageProducts;
