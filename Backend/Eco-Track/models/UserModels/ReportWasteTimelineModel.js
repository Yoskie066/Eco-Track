import pool from '../../config/db.js';

class ReportWasteTimelineModel {
  // Static method to sync data from report_waste to report_waste_timeline
  static async syncFromReportWaste() {
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO report_waste_timeline (useremail, wastename, datereported, location, description, photourl)
        SELECT useremail, wastename, datereported, location, description, photourl
        FROM report_waste
        ON CONFLICT DO NOTHING;
      `);
      console.log("Data synced to report_waste_timeline");
    } catch (err) {
      console.error("Error syncing data:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Static method to get timeline data for a specific user
  static async getUserTimeline(userEmail) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM report_waste_timeline WHERE useremail = $1 ORDER BY datereported DESC`,
        [userEmail]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export default ReportWasteTimelineModel;

