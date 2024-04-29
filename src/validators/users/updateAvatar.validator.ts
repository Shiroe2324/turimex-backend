import { check } from 'express-validator';

import validateImageFile from '@custom-image-validator';

const updateAvatarValidator = [check('files').custom(validateImageFile)];

export default updateAvatarValidator;
