import express from 'express';
import BlockController from '../controllers/block.js';
import WritingController from '../controllers/writing.js';
import {
  validatorsForCreateBlock,
  validatorsForDeleteBlock,
  validatorsForUpdateBlock,
  validatorsForUpdateBlocks,
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
  .route('/:writingId')
  .put(validatorsForUpdateWriting, writingController.update);

const blockPresenter = new BlockPresenter(
  blockModel,
  writingModel,
  BlockService
);
const blockController = new BlockController(blockPresenter);

router
  .route('/:writingId/blocks')
  .post(validatorsForCreateBlock, blockController.create)
  .put(validatorsForUpdateBlocks, writingController.updateBlocks);

router
  .route('/:writingId/blocks/:blockId')
  .put(validatorsForUpdateBlock, blockController.update)
  .delete(validatorsForDeleteBlock, blockController.remove);

export default router;
