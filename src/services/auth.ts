import jwt from 'jsonwebtoken';
import config from '../config/index.js';
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
      return createFailState('이미 존재하는 이메일입니다.', 400);
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
        return createFailState('유저를 찾을 수 없습니다.', 404);
      }

      const isPasswordValid: boolean = await user.isPasswordValid(password);

      if (!isPasswordValid) {
        return createFailState('이메일 혹은 비밀번호가 잘못되었습니다.', 400);
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
