import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.js';
import { IAuthService, UserData } from '../services/auth.js';
import { createError } from '../utils/state.js';

interface IAuthController {
  signup(req: Request, res: Response, next: NextFunction): void;
  signin(req: Request, res: Response, next: NextFunction): void;
}

class AuthController implements IAuthController {
  constructor(private readonly authService: IAuthService) {}

  signup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body;
    const user: User = { email, name, password };

    const result: ResultState<UserData> = await this.authService.signup(user);

    if (result.state === 'fail') {
      return next(createError(result));
    }

    res.json(result.data);
  };

  signin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const result: ResultState<UserData> = await this.authService.signin({
      email,
      password,
    });

    if (result.state === 'fail') {
      return next(createError(result));
    }

    res.json(result.data);
  };
}

export default AuthController;
