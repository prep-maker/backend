import express from 'express';
import WritingController from '../controllers/writing.js';
import {
  userParamValidators,
  validatorsForDeleteWriting,
  validatorsForGetWritings,
} from '../middlewares/validators/index.js';
import blockModel from '../models/block.js';
import userModel from '../models/user.js';
import writingModel from '../models/writing.js';
import WritingPresenter from '../presenter/writing.js';
import WritingService from '../services/writing.js';

const router = express.Router();

const writingPresenter = new WritingPresenter(
  writingModel,
  userModel,
  blockModel,
  WritingService
);
const writingController = new WritingController(writingPresenter);

router
  .route('/:userId/writings')
  .get(validatorsForGetWritings, writingController.getWritings)
  .post(userParamValidators, writingController.create);

router
  .route('/:userId/writings/:writingId')
  .delete(validatorsForDeleteWriting, writingController.remove);

export default router;
