import pool from '../../config/db.js';

class AnalyticsModel {

  // 1. Get overall analytics summary
  static async getSummary() {
    const result = await pool.query(`
      SELECT *
      FROM analytics_summary
      ORDER BY year DESC, month DESC, category, subcategory, unit;
    `);
    return result.rows;
  }

  // 2. Get summary filtered by year/month
  static async getSummaryByDate(year, month) {
    const result = await pool.query(`
      SELECT *
      FROM analytics_summary
      WHERE year = $1 AND month = $2
      ORDER BY category, subcategory, unit;
    `, [year, month]);
    return result.rows;
  }

  // 3. Optional: Get summary by category
  static async getSummaryByCategory(category) {
    const result = await pool.query(`
      SELECT *
      FROM analytics_summary
      WHERE category = $1
      ORDER BY year DESC, month DESC, subcategory, unit;
    `, [category]);
    return result.rows;
  }
}

export default AnalyticsModel;