import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { ERROR } from '../constants/error.js';
import {
  UserAccount,
  UserDocument,
  UserModel,
  UserResponse,
} from '../types/user.js';
import {
  createErrorState,
  createFailState,
  createSuccessState,
} from '../utils/state.js';

export interface IAuthService {
  signup: (user: UserAccount) => Promise<ResultState<UserResponse>>;
  signin: (
    user: Omit<UserAccount, 'name'>
  ) => Promise<ResultState<UserResponse>>;
}

class AuthService implements IAuthService {
  constructor(private readonly userModel: UserModel) {}

  private static createJwtToken = (user: UserDocument): string => {
    const userInfo = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    return jwt.sign(userInfo, config.jwt.secretKey, {
      expiresIn: config.jwt.expiresIn,
    });
  };

  signup = async (user: UserAccount): Promise<ResultState<UserResponse>> => {
    const { email, name, password } = user;
    const found: UserDocument = await this.userModel.findByEmail(email);

    if (found) {
      return createFailState(ERROR.DUPLICATE_EMAIL, 400);
    }

    try {
      const newUser: UserDocument = new this.userModel(user);
      await newUser.setPassword(password);
      await newUser.save();

      const token: string = AuthService.createJwtToken(newUser);

      return createSuccessState({
        id: newUser._id.toString(),
        email,
        name,
        token,
      });
    } catch (error) {
      return createErrorState(error as Error);
    }
  };

  signin = async ({
    email,
    password,
  }: Omit<UserAccount, 'name'>): Promise<ResultState<UserResponse>> => {
    try {
      const user: UserDocument = await this.userModel.findByEmail(email);

      if (!user) {
        return createFailState(ERROR.NOT_FOUND_USER, 404);
      }

      const isPasswordValid: boolean = await user.isPasswordValid(password);

      if (!isPasswordValid) {
        return createFailState(ERROR.INVALID_LOGIN, 400);
      }

      const token: string = AuthService.createJwtToken(user);

      return createSuccessState({
        id: user._id.toString(),
        email,
        name: user.name,
        token,
      });
    } catch (error) {
      return createErrorState(error as Error);
    }
  };
}

export default AuthService;
