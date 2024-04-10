import mongodbProductInterface from '../databases/mongodb/interfaces/product.interface';
import redisUserInterface from '../databases/redis/interfaces/user.interface';

export interface Product extends mongodbProductInterface {}
export interface User extends redisUserInterface {}
