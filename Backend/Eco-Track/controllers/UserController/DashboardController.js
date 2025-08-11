import DashboardModel from "../../models/UserModels/DashboardModel.js";

class DashboardController {
  static async getUserWasteSummary(req, res) {
    try {
      const { email } = req.user; 
      const { year } = req.query;

      if (!year) {
        return res.status(400).json({ error: "Year is required" });
      }

      console.log(`Fetching dashboard data for ${email} in year ${year}`);

      const { collected = [], reported = [] } =
        (await DashboardModel.getUserWasteSummary(email, year)) || {};

      const collectedData = Array(12).fill(0);
      const reportedData = Array(12).fill(0);

      collected.forEach(({ month, count }) => {
        collectedData[month - 1] = Number(count);
      });

      reported.forEach(({ month, count }) => {
        reportedData[month - 1] = Number(count);
      });

      res.json({
        collectedData,
        reportedData,
        message:
          collected.length === 0 && reported.length === 0
            ? "No data found for the given year"
            : "Data fetched successfully",
      });
    } catch (error) {
      console.error("Error in getUserWasteSummary:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DashboardController;
