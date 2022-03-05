import jwt from 'jsonwebtoken';
import config from '../common/config/index.js';
import { ERROR } from '../common/constants/error.js';
import {
  UserAccount,
  UserDocument,
  UserRepository,
  UserResponse,
} from '../common/types/user.js';
import {
  useErrorState,
  useFailState,
  useSuccessState,
} from '../common/utils/state.js';

type UserResult = Promise<ResultState<UserResponse>>;

export interface IAuthService {
  signup: (user: UserAccount) => UserResult;
  signin: (user: Omit<UserAccount, 'name'>) => UserResult;
}

class AuthService implements IAuthService {
  constructor(private readonly userModel: UserRepository) {}

  signup = async (user: UserAccount): UserResult => {
    const found: UserDocument = await this.userModel.findByEmail(user.email);

    if (found) {
      return useFailState(ERROR.DUPLICATE_EMAIL, 400);
    }

    try {
      const newUser = await this.userModel.createNewUser(user);
      const token: string = AuthService.createJwtToken(newUser);

      return useSuccessState({
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        token,
      });
    } catch (error) {
      return useErrorState(error as Error);
    }
  };

  signin = async ({
    email,
    password,
  }: Omit<UserAccount, 'name'>): UserResult => {
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
