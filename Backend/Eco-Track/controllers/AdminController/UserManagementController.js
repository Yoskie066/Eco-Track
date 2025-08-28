import pool from "../../config/db.js";
import UserManagementModel from "../../models/AdminModels/UserManagementModel.js";

class UserManagementController {
  // 🔹 Kukunin lahat ng data mula "Users-Login" at "Admins-Login"
  static async syncFromLoginTables(req, res) {
    const client = await pool.connect();
    try {
      // 🔹 Gamitin double quotes dahil may dash (-) sa table names
      const usersResult = await client.query(`
        SELECT id, email, password, 'user' AS role, "created_at"
        FROM "Users-Login"
      `);
      const adminsResult = await client.query(`
        SELECT id, email, password, 'admin' AS role, "created_at"
        FROM "Admins-Login"
      `);

      const allAccounts = [...usersResult.rows, ...adminsResult.rows];

      // 🔹 Sync bawat account papunta sa user_management
      const synced = [];
      for (const acc of allAccounts) {
        const syncRes = await UserManagementModel.syncFromLoginTable(
          acc.id,
          acc.email,
          acc.password,
          acc.role,
          acc.created_at
        );
        synced.push(syncRes.data || { error: syncRes.error });
      }

      return res.status(200).json({
        success: true,
        message: "All accounts synced successfully to user_management",
        total: synced.length,
        data: synced,
      });
    } catch (err) {
      console.error("SyncAll Error:", err.message);
      res.status(500).json({ success: false, error: err.message });
    } finally {
      client.release();
    }
  }

  // 🔹 Update password via API
  static async updatePassword(req, res) {
    const { email, newPassword } = req.body;

    try {
      const updated = await UserManagementModel.updatePassword(email, newPassword);
      if (!updated) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
        data: updated,
      });
    } catch (err) {
      console.error("UpdatePassword Error:", err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export default UserManagementController;