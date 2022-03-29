import { query } from 'express-validator';
import { ERROR } from '../../common/constants/error.js';

const stateQueryChain = [
  query('state').custom((value) => {
    if (!value) {
      return true;
    }

    if (!['editing', 'done'].includes(value)) {
      throw { message: ERROR.INVALID_WIRINTG_QUERY, status: 400 };
    }

    return true;
  }),
];

export default stateQueryChain;
