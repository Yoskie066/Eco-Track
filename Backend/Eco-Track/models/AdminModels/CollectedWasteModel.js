import pool from "../../config/db.js";

class CollectedWasteModel {
  // Kunin lahat ng collected waste
  static async getAll() {
    const result = await pool.query("SELECT * FROM collected_waste ORDER BY id DESC");
    return result.rows;
  }

  // Kunin collected waste by ID
  static async getById(id) {
    const result = await pool.query("SELECT * FROM collected_waste WHERE id = $1", [id]);
    return result.rows[0];
  }

  // I-update lahat ng fields sa collected_waste
  static async update(id, { useremail, wastename, category, subcategory, quantity, unit, datecollected, description, photourl }) {
    const result = await pool.query(
      `UPDATE collected_waste 
       SET useremail = $1,
           wastename = $2,
           category = $3,
           subcategory = $4,
           quantity = $5,
           unit = $6,
           datecollected = $7,
           description = $8,
           photourl = $9
       WHERE id = $10
       RETURNING *`,
      [useremail, wastename, category, subcategory, quantity, unit, datecollected, description, photourl, id]
    );
    return result.rows[0];
  }

  // Burahin collected waste record (admin only)
  static async delete(id) {
    await pool.query("DELETE FROM collected_waste WHERE id = $1", [id]);
    return { message: "Collected waste deleted successfully" };
  }
}

export default CollectedWasteModel;