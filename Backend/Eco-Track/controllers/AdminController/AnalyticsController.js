import AnalyticsModel from '../../models/AdminModels/AnalyticsModel.js';

class AnalyticsController {

  // Get all analytics
  static async getAnalytics(req, res) {
    try {
      const analytics = await AnalyticsModel.getSummary();
      res.json({
        success: true,
        data: analytics
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics',
        error: err.message
      });
    }
  }

  // Get analytics by year/month
  static async getAnalyticsByDate(req, res) {
    try {
      const { year, month } = req.params;
      const analytics = await AnalyticsModel.getSummaryByDate(parseInt(year), parseInt(month));
      res.json({
        success: true,
        data: analytics
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics by date',
        error: err.message
      });
    }
  }

  // Optional: Get analytics by category
  static async getAnalyticsByCategory(req, res) {
    try {
      const { category } = req.params;
      const analytics = await AnalyticsModel.getSummaryByCategory(category);
      res.json({
        success: true,
        data: analytics
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics by category',
        error: err.message
      });
    }
  }
}

export default AnalyticsController;
