import ReportWasteTimelineModel from '../../models/UserModels/ReportWasteTimelineModel.js';

class ReportWasteTimelineController {
  // Endpoint to sync report_waste data into report_waste_timeline
  static async syncTimeline(req, res) {
    try {
      await ReportWasteTimelineModel.syncFromReportWaste();
      res.status(200).json({ message: "Report waste timeline synced successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to sync report waste timeline." });
    }
  }

  // Endpoint to get timeline data for a specific user
  static async getUserReportWasteTimeline(req, res) {
    try {
       const userEmail = req.user?.email; ;
      if (!userEmail) {
        return res.status(400).json({ error: "Missing userEmail query parameter" });
      }
      const timeline = await ReportWasteTimelineModel.getUserTimeline(userEmail);
      res.status(200).json(timeline);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch report waste timeline." });
    }
  }
}

export default ReportWasteTimelineController;



