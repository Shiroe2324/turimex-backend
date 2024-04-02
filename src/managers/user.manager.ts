import redisUserManager from '../databases/redis/managers/user';

function manageUsers() {
  return { ...redisUserManager() };
}

export default manageUsers;
