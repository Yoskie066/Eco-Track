import { Router } from 'express';
import AdminController from '../../controllers/AdminController/AdminController.js';
import logoutAdmin from '../../controllers/AdminController/LogoutController.js';
import verifyToken  from '../../middleware/verifyToken.js';


const router = Router();

router.post('/admin-register', AdminController.register);
router.post('/admin-login', AdminController.login);
router.post('/admin-forgot-password', AdminController.forgotPassword);
router.post('/logout', verifyToken, logoutAdmin);

export default router;