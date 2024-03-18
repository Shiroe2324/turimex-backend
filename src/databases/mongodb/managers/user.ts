import { Request } from 'express';
import User from '../interfaces/user.interface';
import UserModel from '../models/user.model';

async function getUsers() {
  const users = await UserModel.find({}).select('-password').lean();
  return users;
}

async function getPagenizedUsers(req: Request) {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const sort = (req.query.sort as string) || 'createdAt:desc';
  const sortParams = sort.split(':');
  const sortField = sortParams[0];
  const sortOrder = sortParams[1] === 'asc' ? 1 : -1;

  const users = await UserModel.find({})
    .select('-password')
    .lean()
    .sort({ [sortField]: sortOrder })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  return users;
}

async function getUserById(userId: string) {
  const user = await UserModel.findOne({ userId });
  return user;
}

async function getUserByEmail(email: string) {
  const user = await UserModel.findOne({ email });
  return user;
}

async function cleanUser(user: User): Promise<Partial<User>> {
  const { password, ...cleanedUser } = user.toObject();
  return cleanedUser;
}

async function getUserWithoutPassword(userId: string) {
  const user = await UserModel.findOne({ userId }).select('-password');
  return user;
}

async function createUser(user: Partial<User>) {
  const newUser = await UserModel.create(user);
  await newUser.save();
  return newUser;
}

async function updateUserByEmail(email: string, user: Partial<User>) {
  const updatedUser = await UserModel.findOneAndUpdate({ email }, user, { new: true });
  return updatedUser;
}

async function updateUserById(userId: string, user: Partial<User>) {
  const updatedUser = await UserModel.findOneAndUpdate({ userId }, user, { new: true });
  return updatedUser;
}

async function deleteUserByEmail(email: string) {
  const deletedUser = await UserModel.findOneAndDelete({ email });
  return deletedUser;
}

async function deleteUserById(userId: string) {
  const deletedUser = await UserModel.findOneAndDelete({ userId });
  return deletedUser;
}

async function countUsers() {
  const count = await UserModel.countDocuments();
  return count;
}

function manageUsers() {
  return {
    getUsers,
    getPagenizedUsers,
    getUserById,
    getUserByEmail,
    cleanUser,
    getUserWithoutPassword,
    createUser,
    updateUserByEmail,
    updateUserById,
    deleteUserByEmail,
    deleteUserById,
    countUsers,
  };
}

export default manageUsers;
