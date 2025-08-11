// UserRoutes.js
import { Router } from 'express';
import UserController from '../../controllers/UserController/UserController.js';
import DashboardController from '../../controllers/UserController/DashboardController.js';
import CollectWasteController from '../../controllers/UserController/CollectWasteController.js';
import CollectWasteTimelineController from '../../controllers/UserController/CollectWasteTimelineController.js';
import ReportWasteController from '../../controllers/UserController/ReportWasteController.js';
import ReportWasteTimelineController from '../../controllers/UserController/ReportWasteTimelineController.js';
import verifyToken  from '../../middleware/verifyToken.js';
import multer from '../../middleware/multer.js';
import logout  from '../../controllers/UserController/LogoutController.js';

const router = Router();

// POST routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/collect-waste', verifyToken,multer.single('image'), CollectWasteController.addWaste);
router.post('/collect-waste-timeline/sync', verifyToken, CollectWasteTimelineController.syncTimeline);
router.post('/report-waste', verifyToken,multer.single('image'), ReportWasteController.addReport);
router.post('/report-waste-timeline/sync', verifyToken, ReportWasteTimelineController.syncTimeline);
router.post('/logout', verifyToken, logout);
router.post('/refresh-token', UserController.refreshToken);

// GET routes
router.get('/dashboard', verifyToken, DashboardController.getUserWasteSummary);
router.get('/collect-waste-timeline', verifyToken, CollectWasteTimelineController.getUserCollectWasteTimeline);
router.get('/report-waste-timeline', verifyToken, ReportWasteTimelineController.getUserReportWasteTimeline);
router.get('/my-waste', verifyToken, CollectWasteController.getUserWaste);
router.get('my-reports', verifyToken, ReportWasteController.getUserReports);

export default router;