import { param } from 'express-validator';
import { ERROR } from '../../constants/error.js';
import userModel from '../../models/user.js';
import { UserDocument } from '../../types/user.js';

const userIdChain = [
  param('userId')
    .isMongoId()
    .withMessage({ message: ERROR.INVALID_ID, status: 400 })
    .custom(async (id) => {
      let user: UserDocument | null;
      try {
        user = await userModel.findById(id);
      } catch (error) {
        console.error(error);
        throw error;
      }

      if (user) {
        return true;
      }

      throw { message: ERROR.NOT_FOUND_USER, status: 404 };
    }),
];

export default userIdChain;
