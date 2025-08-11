import pool from '../../config/db.js';

class DashboardModel {
  static async getUserWasteSummary(userEmail, year) {
    try {
      const collectedQuery = `
        SELECT EXTRACT(MONTH FROM date_collected) AS month, COUNT(*) AS count
        FROM collected_waste
        WHERE email = $1 AND EXTRACT(YEAR FROM date_collected) = $2
        GROUP BY month ORDER BY month;
      `;

      const reportedQuery = `
        SELECT EXTRACT(MONTH FROM date_reported) AS month, COUNT(*) AS count
        FROM reported_waste
        WHERE email = $1 AND EXTRACT(YEAR FROM date_reported) = $2
        GROUP BY month ORDER BY month;
      `;

      const collectedResult = await pool.query(collectedQuery, [userEmail, year]);
      const reportedResult = await pool.query(reportedQuery, [userEmail, year]);

      const collected = collectedResult?.rows ?? [];
      const reported = reportedResult?.rows ?? [];

      return { collected, reported };
    } catch (error) {
      console.error("Error in getUserWasteSummary:", error);
      return { error: 'Database error', details: error.message };
    }
  }
}

export default DashboardModel;