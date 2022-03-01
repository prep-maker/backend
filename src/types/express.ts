import { Params, Query } from 'express-serve-static-core';

export interface TypedRequestQueryAndParams<T extends Query, P extends Params>
  extends Express.Request {
  query: T;
  params: P;
}

export type StateQuery = 'editing' | 'done' | undefined;
