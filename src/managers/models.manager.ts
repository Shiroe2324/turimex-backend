import mongodbProductInterface from '../databases/mongodb/interfaces/product.interface';
import mongodbUserInterface from '../databases/mongodb/interfaces/user.interface';

module Models {
  export interface Product extends mongodbProductInterface {}
  export interface User extends mongodbUserInterface {}
}

export default Models;
