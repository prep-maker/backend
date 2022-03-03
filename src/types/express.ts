import { Params, Query } from 'express-serve-static-core';

export interface TypedRequestQueryAndParams<T extends Query, P extends Params>
  extends Express.Request {
  query: T;
  params: P;
}

export interface TypedRequestParams<T extends Params> extends Express.Request {
  params: T;
}

export interface TypedRequestBodyAndParams<T, P extends Params>
  extends Express.Request {
  params: P;
  body: T;
}

export type StateQuery = 'editing' | 'done' | undefined;
