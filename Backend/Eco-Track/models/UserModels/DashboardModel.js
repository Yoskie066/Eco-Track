import pool from '../../config/db.js';

class DashboardModel {
  static async getCollectedWaste() {
    const query = `
      SELECT useremail, wastename, yearcollected, total_count
      FROM dashboard_collected_waste
      ORDER BY yearcollected DESC, total_count DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getReportedWaste() {
    const query = `
      SELECT useremail, wastename, year_reported, total_count
      FROM dashboard_reported_waste
      ORDER BY year_reported DESC, total_count DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default DashboardModel;
