import express from 'express';
import AuthController from '../controllers/auth.js';
import { signupValidators } from '../middlewares/validators/index.js';
import userModel from '../models/user.js';
import AuthService from '../services/auth.js';

const router = express.Router();

const authService = new AuthService(userModel);
const authController = new AuthController(authService);

router.post('/signup', signupValidators, authController.signup);

export default router;
