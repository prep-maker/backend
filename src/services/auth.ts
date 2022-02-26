import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User, UserDocument, UserModel } from '../models/user.js';

export type UserData = {
  userId: string;
  email: string;
  name: string;
  token: string;
};

export interface IAuthService {
  signup: (user: User) => Promise<ResultState<UserData>>;
}

class AuthService implements IAuthService {
  constructor(private readonly userModel: UserModel) {}

  static createJwtToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwt.secretKey, {
      expiresIn: config.jwt.expiresIn,
    });
  };

  signup = async (user: User): Promise<ResultState<UserData>> => {
    const { email, name, password } = user;
    const found = await this.userModel.findByEmail(email);

    if (found) {
      return {
        state: 'fail',
        reason: 'duplicate',
      };
    }

    try {
      const newUser: UserDocument = new this.userModel(user);
      await newUser.setPassword(password);
      await newUser.save();

      const userId = newUser._id.toString();
      const token = AuthService.createJwtToken(userId);

      return {
        state: 'success',
        data: {
          userId,
          email,
          name,
          token,
        },
      };
    } catch (error) {
      return {
        state: 'fail',
        reason: 'unknown',
        error: error as Error,
      };
    }
  };
}

export default AuthService;
