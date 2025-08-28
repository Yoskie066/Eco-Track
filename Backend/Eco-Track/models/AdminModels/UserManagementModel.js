import pool from "../../config/db.js";

class UserManagementModel {
  // 🔹 Sync user or admin data papunta sa user_management
  static async syncFromLoginTable(id, email, password, role, createdAt) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO user_management (id, email, password, role, status, created_at)
         VALUES ($1, $2, $3, $4, 'active', $5)
         ON CONFLICT (email) 
         DO UPDATE SET 
            password = EXCLUDED.password,
            role = EXCLUDED.role,
            status = 'active',
            updated_at = NOW()
         RETURNING id, email, role, status, created_at, updated_at`,
        [id, email.toLowerCase().trim(), password, role, createdAt]
      );
      return { success: true, data: result.rows[0] };
    } catch (err) {
      console.error("UserManagement Sync Error:", err.message);
      return { error: "Sync failed", details: err.message };
    } finally {
      client.release();
    }
  }

  // 🔹 Optional: update password
  static async updatePassword(email, newPassword) {
    const result = await pool.query(
      `UPDATE user_management 
       SET password = $1, updated_at = NOW()
       WHERE email = $2
       RETURNING id, email, role, status, created_at, updated_at`,
      [newPassword, email.toLowerCase().trim()]
    );
    return result.rows[0];
  }
}

export default UserManagementModel;
