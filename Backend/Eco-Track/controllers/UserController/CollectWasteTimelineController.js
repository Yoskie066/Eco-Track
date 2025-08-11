import CollectWasteTimelineModel from '../../models/UserModels/CollectWasteTimelineModel.js';

class CollectWasteTimelineController {
  // Endpoint to sync collect_waste data into collect_waste_timeline
  static async syncTimeline(req, res) {
    try {
      await CollectWasteTimelineModel.syncFromCollectWaste();
      res.status(200).json({ message: "Collect waste timeline synced successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to sync collect waste timeline." });
    }
  }

  // Endpoint to get timeline data for a specific user
  static async getUserCollectWasteTimeline(req, res) {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: "Missing userEmail from authenticated user" });
      }
      const timeline = await CollectWasteTimelineModel.getUserTimeline(userEmail);
      res.status(200).json(timeline);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch collect waste timeline." });
    }
  }
}

export default CollectWasteTimelineController;