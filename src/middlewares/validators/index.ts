import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { useFailState } from '../../common/utils/state.js';
import { writingBodyChain } from './body.js';
import { userIdChain, writingIdChain } from './params.js';
import stateQueryChain from './query.js';
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

  const error: { message: string; status?: number } = errors.array()[0].msg;

  return next(useFailState(error.message, error.status));
};

export const signupValidators = [...signupChain, validate];
export const signinValidators = [...signinChain, validate];

export const userParamValidators = [...userIdChain, validate];
export const validatorsForGetWritings = [
  ...stateQueryChain,
  ...userIdChain,
  validate,
];
export const paramsValidator = [...userIdChain, ...writingIdChain, validate];
export const validatorsForUpdateWriting = [
  ...userIdChain,
  ...writingIdChain,
  ...writingBodyChain,
  validate,
];
