import express from 'express';
import WritingController from '../controllers/writing.js';
import { ValidatorsForGetWritings } from '../middlewares/validators/index.js';
import writingModel from '../models/writing.js';
import WritingService from '../services/writing.js';

const router = express.Router();

const writingService = new WritingService(writingModel);
const writingController = new WritingController(writingService);

router.get(
  '/:userId/writings',
  ValidatorsForGetWritings,
  writingController.getWritings
);

export default router;
