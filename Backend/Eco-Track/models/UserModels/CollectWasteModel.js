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
    return result.rows[0];
  }

  static async updateWaste(id, wasteData) {
  const { wasteName, category, subCategory, quantity, unit, dateCollected, description, photoUrl } = wasteData;

  const query = `
    UPDATE collect_waste
    SET wasteName=$1, category=$2, subCategory=$3, quantity=$4, unit=$5, dateCollected=$6, description=$7, photoUrl=$8
    WHERE id=$9
    RETURNING *;
  `;

  const values = [wasteName, category, subCategory, quantity, unit, dateCollected, description, photoUrl, id];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}
  
  static async deleteWaste(id) {
    const query = `DELETE FROM collect_waste WHERE id=$1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0]; 
  }

  static async getUserWaste(userEmail) {
    const query = `SELECT * FROM collect_waste WHERE userEmail = $1`;
    const result = await pool.query(query, [userEmail]);
    return result.rows;
  }

  static async getWasteById(id) {
    const query = `SELECT * FROM collect_waste WHERE id=$1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}


export default CollectWasteModel;