import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { ERROR } from '../constants/error.js';
import {
  UserAccount,
  UserDocument,
  UserRepository,
  UserResponse,
} from '../types/user.js';
import {
  useErrorState,
  useFailState,
  useSuccessState,
} from '../utils/state.js';

export interface IAuthService {
  signup: (user: UserAccount) => Promise<ResultState<UserResponse>>;
  signin: (
    user: Omit<UserAccount, 'name'>
  ) => Promise<ResultState<UserResponse>>;
}

class AuthService implements IAuthService {
  constructor(private readonly userModel: UserRepository) {}

  signup = async (user: UserAccount): Promise<ResultState<UserResponse>> => {
    const { email, name, password } = user;
    const found: UserDocument = await this.userModel.findByEmail(email);

    if (found) {
      return useFailState(ERROR.DUPLICATE_EMAIL, 400);
    }

    try {
      const newUser: UserDocument = new this.userModel(user);
      await newUser.setPassword(password);
      await newUser.save();

      const token: string = AuthService.createJwtToken(newUser);

      return useSuccessState({
        id: newUser._id.toString(),
        email,
        name,
        token,
      });
    } catch (error) {
      return useErrorState(error as Error);
    }
  };

  signin = async ({
    email,
    password,
  }: Omit<UserAccount, 'name'>): Promise<ResultState<UserResponse>> => {
    try {
      const user: UserDocument = await this.userModel.findByEmail(email);

      if (!user) {
        return useFailState(ERROR.NOT_FOUND_USER, 404);
      }

      const isPasswordValid: boolean = await user.isPasswordValid(password);

      if (!isPasswordValid) {
        return useFailState(ERROR.INVALID_LOGIN, 400);
      }

      const token: string = AuthService.createJwtToken(user);

      return useSuccessState({
        id: user._id.toString(),
        email,
        name: user.name,
        token,
      });
    } catch (error) {
      return useErrorState(error as Error);
    }
  };

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
}

export default AuthService;
