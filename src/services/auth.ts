import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User, UserDocument, UserModel } from '../models/user.js';
import { createErrorState, createSuccessState } from '../utils/state.js';

export type UserData = {
  userId: string;
  email: string;
  name: string;
  token: string;
};

export interface IAuthService {
  signup: (user: User) => Promise<ResultState<UserData>>;
  signin: (user: Omit<User, 'name'>) => Promise<ResultState<UserData>>;
}

class AuthService implements IAuthService {
  constructor(private readonly userModel: UserModel) {}

  private static createJwtToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwt.secretKey, {
      expiresIn: config.jwt.expiresIn,
    });
  };

  signup = async (user: User): Promise<ResultState<UserData>> => {
    const { email, name, password } = user;
    const found: UserDocument = await this.userModel.findByEmail(email);

    if (found) {
      return createErrorState('이미 존재하는 이메일입니다.');
    }

    try {
      const newUser: UserDocument = new this.userModel(user);
      await newUser.setPassword(password);
      await newUser.save();

      const userId = newUser._id.toString();
      const token: string = AuthService.createJwtToken(userId);

      return createSuccessState({
        userId,
        email,
        name,
        token,
      });
    } catch (error) {
      return createErrorState('unknown', error as Error);
    }
  };

  signin = async ({
    email,
    password,
  }: Omit<User, 'name'>): Promise<ResultState<UserData>> => {
    try {
      const user: UserDocument = await this.userModel.findByEmail(email);

      if (!user) {
        return createErrorState('유저를 찾을 수 없습니다.');
      }

      const isPasswordValid: boolean = await user.isPasswordValid(password);

      if (!isPasswordValid) {
        return createErrorState('이메일 혹은 비밀번호가 잘못되었습니다.');
      }

      const userId = user._id.toString();
      const token: string = AuthService.createJwtToken(userId);

      return createSuccessState({
        userId,
        email,
        name: user.name,
        token,
      });
    } catch (error) {
      return createErrorState('unknown', error as Error);
    }
  };
}

export default AuthService;
