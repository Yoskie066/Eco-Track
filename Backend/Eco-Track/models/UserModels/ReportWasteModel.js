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

  static async updateReport(id, reportData) {
    const { wasteName, category, subCategory, color, location, dateReported, description, photoUrl } = reportData;

    const query = `
      UPDATE report_waste
      SET wasteName=$1, category=$2, subCategory=$3, color=$4, location=$5, dateReported=$6, description=$7, photoUrl=$8
      WHERE id=$9
      RETURNING *;
    `;

    const values = [wasteName, category, subCategory, color, location, dateReported, description, photoUrl, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteReport(id) {
    const query = `DELETE FROM report_waste WHERE id=$1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0]; 
  }

  static async getUserReports(userEmail) {
    const query = `SELECT * FROM report_waste WHERE userEmail = $1`;
    const result = await pool.query(query, [userEmail]);
    return result.rows;
  }

  static async getReportById(id) {
    const query = `SELECT * FROM report_waste WHERE id=$1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default ReportWasteModel;
