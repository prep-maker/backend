import express from 'express';
import WritingController from '../controllers/writing.js';
import {
  userAndWritingParamValidators,
  userParamValidators,
  validatorsForGetWritings,
} from '../middlewares/validators/index.js';
import blockModel from '../models/block.js';
import userModel from '../models/user.js';
import writingModel from '../models/writing.js';
import WritingService from '../services/writing.js';

const router = express.Router();

const writingService = new WritingService(writingModel, userModel, blockModel);
const writingController = new WritingController(writingService);

router.get(
  '/:userId/writings',
  validatorsForGetWritings,
  writingController.getWritings
);
router.post('/:userId/writings', userParamValidators, writingController.create);
router.delete(
  '/:userId/writings/:writingId',
  userAndWritingParamValidators,
  writingController.remove
);
router.put('/:userId/writings/:writingId', writingController.update);

export default router;
