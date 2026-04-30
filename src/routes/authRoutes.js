import { Router } from 'express';
const router = Router();
import {
  showSignUpForm,
  showLoginForm,
  postSignUpForm,
  postLoginForm,
  logout,
} from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../validators/authValidatior.js';

router.get('/signup', showSignUpForm);
router.get('/login', showLoginForm);
router.post('/signup', validateSignup, postSignUpForm);
router.post('/login', validateLogin, postLoginForm);
router.post('/logout', logout);

export default router;
