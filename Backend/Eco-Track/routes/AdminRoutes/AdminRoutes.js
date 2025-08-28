import { Router } from 'express';
import AdminController from '../../controllers/AdminController/AdminController.js';
import UserManagementController from '../../controllers/AdminController/UserManagementController.js';
import CollectedWasteController from '../../controllers/AdminController/CollectedWasteController.js';
import ReportedWasteController from '../../controllers/AdminController/ReportedWasteController.js';
import AnalyticsController from '../../controllers/AdminController/AnalyticsController.js';
import logoutAdmin from '../../controllers/AdminController/LogoutController.js';
import verifyToken  from '../../middleware/verifyToken.js';


const router = Router();

//POST Routes
router.post('/admin-register', AdminController.register);
router.post('/admin-login', AdminController.login);
router.post('/admin-forgot-password', AdminController.forgotPassword);
router.post('/refresh-token', AdminController.refreshToken);
router.post('/logout', verifyToken, logoutAdmin);

//GET Routes
router.get("/user-management", UserManagementController.syncFromLoginTables);
router.get("/collected-waste", CollectedWasteController.getAll);
router.get("/collected-waste/:id", CollectedWasteController.getById);
router.get("/reported-waste", ReportedWasteController.getAll);
router.get("/reported-waste/:id", ReportedWasteController.getById);
router.get("/analytics", AnalyticsController.getAnalytics);
router.get('/analytics/:year/:month', AnalyticsController.getAnalyticsByDate);
router.get('/analytics/category/:category', AnalyticsController.getAnalyticsByCategory);

//PUT Routes
router.put("/collected-waste/:id", CollectedWasteController.updateCollectedWaste);
router.put("/reported-waste/:id", ReportedWasteController.updateReportedWaste);

//DELETE Routes
router.delete("/collected-waste/:id", CollectedWasteController.delete);
router.delete("/reported-waste/:id", ReportedWasteController.delete);

export default router;