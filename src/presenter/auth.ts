import { pipe } from '@fxts/core';
import { ERROR } from '../common/constants/error.js';
import {
  UserAccount,
  UserDocument,
  UserRepository,
  UserResponse,
} from '../common/types/user.js';
import catchError from '../common/utils/catchError.js';
import { useFailState } from '../common/utils/state.js';
import AuthService, { IAuthService } from '../services/auth.js';

type UserResult = Promise<ResultState<UserResponse>>;

export interface IAuthPresenter {
  signup: (user: UserAccount) => UserResult;
  signin: (user: Omit<UserAccount, 'name'>) => UserResult;
}

class AuthPresenter implements IAuthPresenter {
  private readonly authService: IAuthService;

  constructor(
    private readonly userModel: UserRepository,
    private readonly AuthService: new (userModel: UserRepository) => AuthService
  ) {
    this.authService = new this.AuthService(this.userModel);
  }

  signup = async (user: UserAccount): UserResult => {
    const found: UserDocument = await this.userModel.findByEmail(user.email);

    if (found) {
      return useFailState(ERROR.DUPLICATE_EMAIL, 400);
    }

    const result = await pipe(
      this.authService.signup.bind(this, user),
      catchError
    );

    return result;
  };

  signin = async ({
    email,
    password,
  }: Omit<UserAccount, 'name'>): UserResult => {
    const user: UserDocument = await this.userModel.findByEmail(email);

    if (!user) {
      return useFailState(ERROR.NOT_FOUND_USER, 404);
    }

    const isPasswordValid: boolean = await user.isPasswordValid(password);

    if (!isPasswordValid) {
      return useFailState(ERROR.INVALID_LOGIN, 400);
    }

    const result = await pipe(
      this.authService.signin.bind(this, user),
      catchError
    );

    return result;
  };
}

export default AuthPresenter;
