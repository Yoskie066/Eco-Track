import CollectWasteTimelineModel from '../../models/UserModels/CollectWasteTimelineModel.js';
import ReportWasteTimelineModel from '../../models/UserModels/ReportWasteTimelineModel.js';
import DashboardModel from '../../models/UserModels/DashboardModel.js';

class DashboardController {
  static async getDashboardSummary(req, res) {
    try {
      const userEmail = req.user.email;

      // Sync timeline tables first
      await CollectWasteTimelineModel.syncFromCollectWaste();
      await ReportWasteTimelineModel.syncFromReportWaste();

      // Fetch dashboard summary
      const summary = await DashboardModel.getDashboardSummary(userEmail);

      res.json({
        success: true,
        user: { email: userEmail },
        data: summary
      });

    } catch (err) {
      console.error("Error fetching dashboard summary:", err);
      res.status(500).json({
        success: false,
        message: "Error fetching dashboard summary",
        error: err.message
      });
    }
  }
}

export default DashboardController;
