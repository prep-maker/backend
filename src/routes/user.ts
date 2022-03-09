import express from 'express';
import BlockController from '../controllers/block.js';
import WritingController from '../controllers/writing.js';
import {
  userParamValidators,
  validatorForUpdateBlocks,
  validatorsForCreateBlock,
  validatorsForDeleteBlock,
  validatorsForDeleteWriting,
  validatorsForGetWritings,
  validatorsForUpdateBlock,
  validatorsForUpdateWriting,
} from '../middlewares/validators/index.js';
import blockModel from '../models/block.js';
import userModel from '../models/user.js';
import writingModel from '../models/writing.js';
import BlockPresenter from '../presenter/block.js';
import WritingPresenter from '../presenter/writing.js';
import BlockService from '../services/block.js';
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
  .delete(validatorsForDeleteWriting, writingController.remove)
  .put(validatorsForUpdateWriting, writingController.update);

const blockPresenter = new BlockPresenter(
  blockModel,
  writingModel,
  BlockService
);
const blockController = new BlockController(blockPresenter);

router
  .route('/:userId/writings/:writingId/blocks')
  .post(validatorsForCreateBlock, blockController.create)
  .put(validatorForUpdateBlocks, writingController.updateBlocks);

router
  .route('/:userId/writings/:writingId/blocks/:blockId')
  .delete(validatorsForDeleteBlock, blockController.remove)
  .put(validatorsForUpdateBlock, blockController.update);

export default router;
