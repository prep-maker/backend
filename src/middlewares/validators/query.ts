import { query } from 'express-validator';
import { ERROR } from '../../constants/error.js';

const stateQueryChain = [
  query('state').custom((value) => {
    if (!value) {
      return true;
    }

    if (!['editing', 'done'].includes(value)) {
      throw new Error(ERROR.INVALID_WIRINTG_QUERY);
    }

    return true;
  }),
];

export default stateQueryChain;
