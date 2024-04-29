import { Repository, Schema } from 'redis-om';

import { getRedisClient } from '@redis/connection';

const userSchema = new Schema(
  'user',
  {
    avatar_public_id: {
      type: 'string',
      path: '$.avatar.public_id',
    },
    avatar_url: {
      type: 'string',
      path: '$.avatar.url',
    },
    createdAt: {
      type: 'date',
    },
    email: {
      type: 'string',
    },
    isAdmin: {
      type: 'boolean',
    },
    isVerified: {
      type: 'boolean',
    },
    password: {
      type: 'string',
    },
    updatedAt: {
      type: 'date',
    },
    userId: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
  },
  {
    dataStructure: 'JSON',
  },
);

const getUserRepository = () => {
  const userRepository = new Repository(userSchema, getRedisClient());
  userRepository.createIndex();
  return userRepository;
};

export default getUserRepository;
