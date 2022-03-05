import express from 'express';
import AuthController from '../controllers/auth.js';
import {
  signinValidators,
  signupValidators,
} from '../middlewares/validators/index.js';
import userModel from '../models/user.js';
import AuthPresenter from '../presenter/auth.js';
import AuthService from '../services/auth.js';

const router = express.Router();

const authPresenter = new AuthPresenter(userModel, AuthService);
const authController = new AuthController(authPresenter);

router.post('/signup', signupValidators, authController.signup);
router.post('/signin', signinValidators, authController.signin);

export default router;
