import pool from '../../config/db.js';

class DashboardController {
  //Collected Waste Controller
  static async updateCollectedWasteDashboard(req, res) {
    try {
      const userEmail = req.user.email;

      const summaryResult = await pool.query(`
        SELECT 
          useremail,
          wastename,
          COUNT(*) AS total_count,
          EXTRACT(YEAR FROM datecollected) AS yearcollected
        FROM collect_waste_timeline
        WHERE useremail = $1
        GROUP BY useremail, wastename, EXTRACT(YEAR FROM datecollected)
      `, [userEmail]);

      for (let row of summaryResult.rows) {
        await pool.query(`
          INSERT INTO dashboard_collected_waste (useremail, wastename, total_count, yearcollected)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (useremail, wastename, yearcollected) 
          DO UPDATE SET total_count = EXCLUDED.total_count
        `, [row.useremail, row.wastename, row.total_count, row.yearcollected]);
      }

      res.json({
        success: true,
        message: "Dashboard collected waste updated successfully"
      });

    } catch (err) {
      console.error("Error updating dashboard data:", err);
      res.status(500).json({
        success: false,
        message: "Error updating dashboard data",
        error: err.message
      });
    }
  }

  static async getDashboardCollectedWaste(req, res) {
  try {
    const userEmail = req.user.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email not found'
      });
    }

    const result = await pool.query(`
      SELECT useremail, wastename, total_count, yearcollected
      FROM dashboard_collected_waste
      WHERE useremail = $1
      ORDER BY yearcollected DESC
    `, [userEmail]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: err.message
    });
  }
}

   // ----- Reported Waste -----
  static async updateReportedWasteDashboard(req, res) {
    try {
      const userEmail = req.user.email;

      const summaryResult = await pool.query(`
        SELECT 
          useremail,
          wastename,
          COUNT(*) AS total_count,
          EXTRACT(YEAR FROM datereported) AS year_reported
        FROM report_waste_timeline
        WHERE useremail = $1
        GROUP BY useremail, wastename, EXTRACT(YEAR FROM datereported)
      `, [userEmail]);

      for (let row of summaryResult.rows) {
        await pool.query(`
          INSERT INTO dashboard_reported_waste (useremail, wastename, total_count, year_reported)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (useremail, wastename, year_reported) 
          DO UPDATE SET total_count = EXCLUDED.total_count
        `, [row.useremail, row.wastename, row.total_count, row.year_reported]);
      }

      res.json({
        success: true,
        message: "Dashboard reported waste updated successfully"
      });

    } catch (err) {
      console.error("Error updating reported waste dashboard:", err);
      res.status(500).json({
        success: false,
        message: "Error updating reported waste dashboard",
        error: err.message
      });
    }
  }

  static async getDashboardReportedWaste(req, res) {
    try {
      const userEmail = req.user.email;

      if (!userEmail) {
        return res.status(400).json({
          success: false,
          message: 'User email not found'
        });
      }

      const result = await pool.query(`
        SELECT useremail, wastename, total_count, year_reported
        FROM dashboard_reported_waste
        WHERE useremail = $1
        ORDER BY year_reported DESC
      `, [userEmail]);

      res.json({
        success: true,
        data: result.rows
      });

    } catch (err) {
      console.error("Error fetching reported waste dashboard:", err);
      res.status(500).json({
        success: false,
        message: "Error fetching reported waste dashboard",
        error: err.message
      });
    }
  }
}

export default DashboardController;
