import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.js';
import { IAuthService, UserData } from '../services/auth.js';

interface IAuthController {
  signup(req: Request, res: Response, next: NextFunction): void;
}

class AuthController implements IAuthController {
  constructor(private readonly authService: IAuthService) {}

  signup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body;
    const user: User = { email, name, password };

    const result: ResultState<UserData> = await this.authService.signup(user);

    if (result.state === 'fail') {
      const error =
        result.reason === 'unknown' ? result.error : new Error(result.reason);
      return next(error);
    }

    res.json(result.data);
  };
}

export default AuthController;
