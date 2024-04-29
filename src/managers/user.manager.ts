import redisUserManager from '@redis/managers/user';

function userManager() {
  return { ...redisUserManager() };
}

export default userManager;
