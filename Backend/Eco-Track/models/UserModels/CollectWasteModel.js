import pool from '../../config/db.js';

class CollectWasteModel {
  static async addWaste(wasteData) {
    const {
      userEmail,
      wasteName,
      category,
      subCategory,
      quantity,
      unit,
      dateCollected,
      description,
      photoUrl
    } = wasteData;

    const query = `
      INSERT INTO collect_waste
      (userEmail, wasteName, category, subCategory, quantity, unit, dateCollected, description, photoUrl)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const values = [
      userEmail,
      wasteName,
      category,
      subCategory,
      quantity,
      unit,
      dateCollected,
      description,
      photoUrl
    ];

    const result = await pool.query(query, values);
    return { id: result.rows[0].id };
  }

  static async getUserWaste(userEmail) {
    const query = `SELECT * FROM collect_waste WHERE userEmail = $1`;
    const result = await pool.query(query, [userEmail]);
    return result.rows;
  }
}


export default CollectWasteModel;