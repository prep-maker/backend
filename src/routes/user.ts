import express from 'express';
import WritingController from '../controllers/writing.js';
import {
  userParamValidators,
  validatorsForDeleteWriting,
  validatorsForGetWritings,
  validatorsForUpdateWriting,
} from '../middlewares/validators/index.js';
import blockModel from '../models/block.js';
import userModel from '../models/user.js';
import writingModel from '../models/writing.js';
import WritingService from '../services/writing.js';

const router = express.Router();

const writingService = new WritingService(writingModel, userModel, blockModel);
const writingController = new WritingController(writingService);

router
  .route('/:userId/writings')
  .get(validatorsForGetWritings, writingController.getWritings)
  .post(userParamValidators, writingController.create);

router
  .route('/:userId/writings/:writingId')
  .delete(validatorsForDeleteWriting, writingController.remove)
  .put(validatorsForUpdateWriting, writingController.update);

export default router;
