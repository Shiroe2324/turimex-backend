import type { SignOptions } from 'jsonwebtoken';
import JWT from 'jsonwebtoken';

import { User } from '@managers/models.manager';
import config from '@utils/config';

type TokenType = keyof typeof jwtSecrets;

interface UserPayload {
  user: string;
}

const { jwtSecrets } = config;

function createToken(user: User, tokenType: TokenType): string {
  const isValidation = tokenType === 'validation';
  const options: SignOptions = isValidation ? { expiresIn: '4h' } : {};

  const token = JWT.sign({ user: user.userId }, jwtSecrets[tokenType], options);
  return token;
}

function verifyToken(token: string, tokenType: TokenType): string {
  const decoded = JWT.verify(token, jwtSecrets[tokenType]) as UserPayload;
  return decoded.user;
}

function tokenManager() {
  return {
    createToken,
    verifyToken,
  };
}

export default tokenManager;
