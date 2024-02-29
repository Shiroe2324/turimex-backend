import mongodbUserManager from '../databases/mongodb/managers/user';

function manageUsers() {
  return { ...mongodbUserManager() };
}

export default manageUsers;
