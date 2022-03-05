import { NextFunction, Request, Response } from 'express';
import { UserAccount, UserResponse } from '../common/types/user.js';
import { IAuthPresenter } from '../presenter/auth.js';

interface IAuthController {
  signup(req: Request, res: Response, next: NextFunction): void;
  signin(req: Request, res: Response, next: NextFunction): void;
}

class AuthController implements IAuthController {
  constructor(private readonly authPresenter: IAuthPresenter) {}

  signup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body;
    const user: UserAccount = { email, name, password };
    const result: ResultState<UserResponse> = await this.authPresenter.signup(
      user
    );

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };

  signin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result: ResultState<UserResponse> = await this.authPresenter.signin({
      email,
      password,
    });

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };
}

export default AuthController;
