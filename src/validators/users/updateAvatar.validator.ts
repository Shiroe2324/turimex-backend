import { check } from 'express-validator';
import validateImageFile from '../image.validator';

const updateAvatarValidator = [check('files').custom(validateImageFile)];

export default updateAvatarValidator;
