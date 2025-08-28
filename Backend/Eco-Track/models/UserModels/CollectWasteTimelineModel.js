import pool from '../../config/db.js';

class CollectWasteTimelineModel {
  // Sync collect_waste → collect_waste_timeline (with update)
  static async syncFromCollectWaste() {
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO collect_waste_timeline(waste_id, useremail, wastename, datecollected, description, photourl, yearcollected)
        SELECT id, useremail, wastename, datecollected, description, photourl, EXTRACT(YEAR FROM datecollected)::INT
        FROM collect_waste
        ON CONFLICT (waste_id)
        DO UPDATE SET
          useremail = EXCLUDED.useremail,
          wastename = EXCLUDED.wastename,
          datecollected = EXCLUDED.datecollected,
          description = EXCLUDED.description,
          photourl = EXCLUDED.photourl,
          yearcollected = EXCLUDED.yearcollected;
      `);
    } finally {
      client.release();
    }
  }

  // Get user timeline
  static async getUserTimeline(useremail) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT *
         FROM collect_waste_timeline
         WHERE useremail = $1
         ORDER BY datecollected DESC`,
        [useremail]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export default CollectWasteTimelineModel;
