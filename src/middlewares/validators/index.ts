import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createFailState } from '../../utils/state.js';
import stateQueryChain from './query.js';
import signinChain from './signin.js';
import signupChain from './signup.js';
import userIdChain from './userId.js';

const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const error: { message: string; status?: number } = errors.array()[0].msg;

  return next(createFailState(error.message, error.status));
};

export const signupValidators = [...signupChain, validate];
export const signinValidators = [...signinChain, validate];
export const ValidatorsForGetWritings = [
  ...stateQueryChain,
  ...userIdChain,
  validate,
];
