import mongodbProductInterface from '../databases/mongodb/interfaces/product.interface';
import redisUserInterface from '../databases/redis/interfaces/user.interface';

module Models {
  export interface Product extends mongodbProductInterface {}
  export interface User extends redisUserInterface {}
}

export default Models;
