import { Router } from 'express';
import UserController from '../../controllers/UserController/UserController.js';
import DashboardController from '../../controllers/UserController/DashboardController.js';
import CollectWasteController from '../../controllers/UserController/CollectWasteController.js';
import CollectWasteTimelineController from '../../controllers/UserController/CollectWasteTimelineController.js';
import ReportWasteController from '../../controllers/UserController/ReportWasteController.js';
import ReportWasteTimelineController from '../../controllers/UserController/ReportWasteTimelineController.js';
import verifyToken  from '../../middleware/verifyToken.js';
import multer from '../../middleware/multer.js';
import logoutUser  from '../../controllers/UserController/LogoutController.js';

const router = Router();

// POST routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/collect-waste', verifyToken,multer.single('image'), CollectWasteController.addWaste);
router.post('/collect-waste-timeline/sync', verifyToken, CollectWasteTimelineController.syncTimeline);
router.post('/dashboard/collected/update', verifyToken, DashboardController.updateCollectedWasteDashboard);
router.post('/dashboard/reported/update', verifyToken, DashboardController.updateReportedWasteDashboard);
router.post('/report-waste', verifyToken,multer.single('image'), ReportWasteController.addReport);
router.post('/report-waste-timeline/sync', verifyToken, ReportWasteTimelineController.syncTimeline);
router.post('/logout', verifyToken, logoutUser);
router.post('/refresh-token', UserController.refreshToken);

// GET routes
router.get('/dashboard/collected', verifyToken, DashboardController.getDashboardCollectedWaste);
router.get('/dashboard/reported', verifyToken, DashboardController.getDashboardReportedWaste);
router.get('/collect-waste-timeline', verifyToken, CollectWasteTimelineController.getUserCollectWasteTimeline);
router.get('/report-waste-timeline', verifyToken, ReportWasteTimelineController.getUserReportWasteTimeline);


export default router;