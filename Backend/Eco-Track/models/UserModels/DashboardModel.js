import pool from '../../config/db.js';

class DashboardModel {
  static async getDashboardSummary(userEmail) {
    const collectedQuery = `
      SELECT 
        EXTRACT(YEAR FROM datecollected)::INT AS year,
        TO_CHAR(datecollected, 'Month') AS month,
        COUNT(*)::INT AS collected_count
      FROM collect_waste_timeline
      WHERE useremail = $1
      GROUP BY year, month
      ORDER BY year, MIN(datecollected)
    `;

    const reportedQuery = `
      SELECT 
        EXTRACT(YEAR FROM datereported)::INT AS year,
        TO_CHAR(datereported, 'Month') AS month,
        COUNT(*)::INT AS reported_count
      FROM report_waste_timeline
      WHERE useremail = $1
      GROUP BY year, month
      ORDER BY year, MIN(datereported)
    `;

    const collected = await pool.query(collectedQuery, [userEmail]);
    const reported = await pool.query(reportedQuery, [userEmail]);

    // Merging logic
    const summary = {};

    // Process collected
    collected.rows.forEach(row => {
      const { year, month, collected_count } = row;
      if (!summary[year]) summary[year] = {};
      if (!summary[year][month.trim()]) {
        summary[year][month.trim()] = { collected_waste: 0, reported_waste: 0 };
      }
      summary[year][month.trim()].collected_waste = collected_count;
    });

    // Process reported
    reported.rows.forEach(row => {
      const { year, month, reported_count } = row;
      if (!summary[year]) summary[year] = {};
      if (!summary[year][month.trim()]) {
        summary[year][month.trim()] = { collected_waste: 0, reported_waste: 0 };
      }
      summary[year][month.trim()].reported_waste = reported_count;
    });

    return summary;
  }
}

export default DashboardModel;
