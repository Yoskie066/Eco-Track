import pool from '../../config/db.js';

class ReportWasteTimelineModel {
  // Sync report_waste → report_waste_timeline (with update)
  static async syncFromReportWaste() {
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO report_waste_timeline(
          report_id, useremail, wastename, datereported, location, description, photourl, year_reported
        )
        SELECT id, useremail, wastename, dateReported, location, description, photoUrl, EXTRACT(YEAR FROM dateReported)::INT
        FROM report_waste
        ON CONFLICT (report_id)
        DO UPDATE SET
          useremail    = EXCLUDED.useremail,
          wastename    = EXCLUDED.wastename,
          datereported = EXCLUDED.datereported,
          location     = EXCLUDED.location,
          description  = EXCLUDED.description,
          photourl     = EXCLUDED.photourl,
          year_reported= EXCLUDED.year_reported;
      `);
    } finally {
      client.release();
    }
  }

  // Get user timeline
  static async getUserTimeline(useremail) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT *
         FROM report_waste_timeline
         WHERE useremail = $1
         ORDER BY datereported DESC`,
        [useremail]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export default ReportWasteTimelineModel;
