import pool from '../../config/db.js';

class CollectWasteTimelineModel {
  // Static method to sync data from collect_waste to collect_waste_timeline
  static async syncFromCollectWaste() {
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO collect_waste_timeline (useremail, wastename, datecollected, description, photourl, yearcollected)
        SELECT useremail, wastename, datecollected, description, photourl, EXTRACT(YEAR FROM datecollected)::INT
        FROM collect_waste
        ON CONFLICT DO NOTHING;
      `);
      console.log("Data synced to collect_waste_timeline");
    } catch (err) {
      console.error("Error syncing data:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Sync data from collect_waste_timeline to dashboard_collected_waste
  static async syncFromCollectWasteTimeline() {
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO dashboard_collected_waste (useremail, wastename, datecollected, description, photourl, yearcollected)
        SELECT useremail, wastename, datecollected, description, photourl, EXTRACT(YEAR FROM datecollected)::INT
        FROM collect_waste_timeline
        ON CONFLICT (useremail, wastename, datecollected) DO NOTHING;
      `);
      console.log("Data synced to dashboard_collected_waste");
    } catch (err) {
      console.error("Error syncing data:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // Static method to get timeline data for a specific user
  static async getUserTimeline(userEmail) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM collect_waste_timeline WHERE useremail = $1 ORDER BY datecollected DESC`,
        [userEmail]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export default CollectWasteTimelineModel;

