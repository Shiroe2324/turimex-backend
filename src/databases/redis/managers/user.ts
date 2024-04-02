import { Request } from 'express';
import { EntityId } from 'redis-om';
import { getRedisClient } from '../connection';
import User from '../interfaces/user.interface';
import getUserRepository from '../repositories/user.repository';

const search = () => getUserRepository().search();
const searchById = (userId: string) => search().where('userId').is.equalTo(userId);
const searchByEmail = (email: string) => search().where('email').is.equalTo(email);

async function generateUserId() {
  const counter = await getRedisClient().get('user_counter');
  const userId = parseInt(counter || '0', 10) + 1;
  await getRedisClient().set('user_counter', userId.toString());
  return userId.toString();
}

function cleanUser(user: User) {
  const userCopy = user;
  delete userCopy.password;
  return userCopy;
}

async function countUsers() {
  const count = await search().return.count();
  return count;
}

async function createUser(user: Partial<User>) {
  const id = await generateUserId();
  const date = new Date();

  user.userId = id;
  user.createdAt = date;
  user.updatedAt = date;

  const newUser = (await getUserRepository().save(user)) as User;
  return newUser;
}

async function deleteUserByEmail(email: string) {
  const user = (await searchByEmail(email).return.first()) as User | null;

  if (user && user[EntityId]) {
    getUserRepository().remove(user[EntityId]);
  }

  return user;
}

async function deleteUserById(userId: string) {
  const user = (await searchById(userId).return.first()) as User | null;

  if (user && user[EntityId]) {
    getUserRepository().remove(user[EntityId]);
  }

  return user;
}

async function getPagenizedUsers(req: Request) {
  const page = (parseInt(req.query.page as string) || 1) - 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const offset = page === 0 ? 0 : page * pageSize - 1;

  const sort = (req.query.sort as string) || 'createdAt:desc';
  const sortParams = sort.split(':');
  const sortField = sortParams[0];
  const sortOrder = sortParams[1] === 'asc' ? 'ASC' : 'DESC';

  const users = (await search()
    .sortBy(sortField, sortOrder)
    .return.page(offset, pageSize)) as User[];

  users.forEach((user) => {
    delete user.password;
  });

  return users;
}

async function getUserByEmail(email: string) {
  const user = (await searchByEmail(email).return.first()) as User | null;
  return user;
}

async function getUserById(userId: string) {
  const user = (await searchById(userId).return.first()) as User | null;
  return user;
}

async function getUsers() {
  const users = (await search().return.all()) as User[];

  users.forEach((user) => {
    delete user.password;
  });

  return users;
}

async function getUserWithoutPassword(userId: string) {
  const user = (await searchById(userId).return.first()) as User | null;

  if (user) {
    delete user.password;
  }

  return user;
}

async function updateUserByEmail(email: string, data: Partial<User>) {
  const user = (await searchByEmail(email).return.first()) as User | null;

  if (!user) {
    return null;
  }

  const date = new Date();

  user.avatar = data.avatar || user.avatar;
  user.email = data.email || user.email;
  user.isAdmin = data.isAdmin || user.isAdmin;
  user.isVerified = data.isVerified || user.isVerified;
  user.password = data.password || user.password;
  user.updatedAt = date;
  user.username = data.username || user.username;

  const updatedUser = (await getUserRepository().save(user)) as User;
  return updatedUser;
}

async function updateUserById(userId: string, data: Partial<User>) {
  const user = (await searchById(userId).return.first()) as User | null;

  if (!user) {
    return null;
  }

  const date = new Date();

  user.avatar = data.avatar || user.avatar;
  user.email = data.email || user.email;
  user.isAdmin = data.isAdmin || user.isAdmin;
  user.isVerified = data.isVerified || user.isVerified;
  user.password = data.password || user.password;
  user.updatedAt = date;
  user.username = data.username || user.username;

  const updatedUser = (await getUserRepository().save(user)) as User;
  return updatedUser;
}

function manageUsers() {
  return {
    cleanUser,
    countUsers,
    createUser,
    deleteUserByEmail,
    deleteUserById,
    getPagenizedUsers,
    getUserByEmail,
    getUserById,
    getUsers,
    getUserWithoutPassword,
    updateUserByEmail,
    updateUserById,
  };
}

export default manageUsers;
