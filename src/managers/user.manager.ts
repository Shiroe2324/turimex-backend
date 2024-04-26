import redisUserManager from '../databases/redis/managers/user';

function userManager() {
  return { ...redisUserManager() };
}

export default userManager;
