import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import signinChain from './signin.js';
import signupChain from './signup.js';

const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ message: errors.array()[0].msg });
};

export const signupValidators = [...signupChain, validate];
export const signinValidators = [...signinChain, validate];
