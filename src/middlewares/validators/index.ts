import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { useFailState } from '../../common/utils/state.js';
import {
  blockBodyChain,
  blockListBodyChain,
  signinBodyChain,
  signupBodyChain,
  writingBodyChain,
} from './body.js';
import { blockIdChain, userIdChain, writingIdChain } from './params.js';
import stateQueryChain from './query.js';

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

export const signupValidators = [...signupBodyChain, validate];

export const signinValidators = [...signinBodyChain, validate];

export const userParamValidators = [...userIdChain, validate];

export const validatorsForGetWritings = [
  ...stateQueryChain,
  ...userIdChain,
  validate,
];

export const validatorsForDeleteWriting = [
  ...userIdChain,
  ...writingIdChain,
  validate,
];

export const validatorsForUpdateWriting = [
  ...writingIdChain,
  ...writingBodyChain,
  validate,
];

export const validatorsForCreateBlock = [
  ...writingIdChain,
  ...blockBodyChain,
  validate,
];

export const validatorsForDeleteBlock = [
  ...writingIdChain,
  ...blockIdChain,
  validate,
];

export const validatorsForUpdateBlocks = [
  ...writingIdChain,
  ...blockListBodyChain,
  validate,
];

export const validatorsForUpdateBlock = [
  ...writingIdChain,
  ...blockIdChain,
  ...blockBodyChain,
  validate,
];
