import pool from '../../config/db.js';

class ReportWasteModel {
  static async addReport(reportData) {
    const {
      userEmail,
      wasteName,
      category,
      subCategory,
      color,
      location,
      dateReported,
      description,
      photoUrl
    } = reportData;

    const query = `
      INSERT INTO report_waste
      (userEmail, wasteName, category, subCategory, color, location, dateReported, description, photoUrl)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `;

    const values = [
      userEmail,
      wasteName,
      category,
      subCategory,
      color,
      location,
      dateReported,
      description,
      photoUrl
    ];

    const result = await pool.query(query, values);
    return { id: result.rows[0].id };
  }

  static async getUserReports(userEmail) {
    const query = `SELECT * FROM report_waste WHERE userEmail = $1`;
    const result = await pool.query(query, [userEmail]);
    return result.rows;
  }
}

export default ReportWasteModel;
