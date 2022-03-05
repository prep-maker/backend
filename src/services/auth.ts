import jwt from 'jsonwebtoken';
import config from '../common/config/index.js';
import {
  UserAccount,
  UserDocument,
  UserRepository,
  UserResponse,
} from '../common/types/user.js';
import { useSuccessState } from '../common/utils/state.js';

type UserResult = Promise<SuccessState<UserResponse>>;

export interface IAuthService {
  signup: (user: UserAccount) => UserResult;
  signin: (user: UserDocument) => UserResult;
}

class AuthService implements IAuthService {
  constructor(private readonly userModel: UserRepository) {}

  signup = async (user: UserAccount): UserResult => {
    const newUser = await this.userModel.createNewUser(user);
    const token: string = AuthService.createJwtToken(newUser);

    return useSuccessState({
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      token,
    });
  };

  signin = async (user: UserDocument): UserResult => {
    const token: string = AuthService.createJwtToken(user);

    return useSuccessState({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      token,
    });
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
