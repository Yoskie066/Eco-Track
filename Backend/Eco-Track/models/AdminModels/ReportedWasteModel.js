import pool from "../../config/db.js";

class ReportedWasteModel {
  static async getAll() {
    const result = await pool.query("SELECT * FROM reported_waste ORDER BY id DESC");
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query("SELECT * FROM reported_waste WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async update(id, { useremail, wastename, category, subcategory, color, location, datereported, description, photourl }) {
    const result = await pool.query(
      `UPDATE reported_waste
       SET useremail = $1,
           wastename = $2,
           category = $3,
           subcategory = $4,
           color = $5,
           location = $6,
           datereported = $7,
           description = $8,
           photourl = $9
       WHERE id = $10
       RETURNING *`,
      [useremail, wastename, category, subcategory, color, location, datereported, description, photourl, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query("DELETE FROM reported_waste WHERE id = $1", [id]);
    return { message: "Reported waste deleted successfully" };
  }
}

export default ReportedWasteModel;
