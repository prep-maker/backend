import express from 'express';
import WritingController from '../controllers/writing.js';
import {
  userIdValidators,
  ValidatorsForGetWritings,
} from '../middlewares/validators/index.js';
import userModel from '../models/user.js';
import writingModel from '../models/writing.js';
import WritingService from '../services/writing.js';

const router = express.Router();

const writingService = new WritingService(writingModel, userModel);
const writingController = new WritingController(writingService);

router.get(
  '/:userId/writings',
  ValidatorsForGetWritings,
  writingController.getWritings
);
router.post('/:userId/writings', userIdValidators, writingController.create);

export default router;
