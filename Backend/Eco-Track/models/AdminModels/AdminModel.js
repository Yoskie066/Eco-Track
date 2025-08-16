import pool from '../../config/db.js';
import bcrypt from 'bcryptjs';

class AdminModel {
  /**
   * Register new admin
   */
  static async register(email, password) {
    const client = await pool.connect();
    try {
      if (!email || !password) {
        return { error: 'Email and password are required' };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await client.query(
        `INSERT INTO "Admins-Login" (email, password)
         VALUES ($1, $2)
         RETURNING id, email, created_at`,
        [email.toLowerCase().trim(), hashedPassword]
      );

      return { success: true, admin: result.rows[0] };
    } catch (err) {
      console.error('Admin Registration Error:', err.message);

      if (err.code === '23505') {
        return { error: 'Email already registered' };
      }

      return { error: 'Registration failed', details: err.message };
    } finally {
      client.release();
    }
  }

  /**
   * Find admin by email
   */
  static async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM "Admins-Login" WHERE email = $1',
        [email.toLowerCase().trim()]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Verify password
   */
  static async verifyPassword(email, password) {
    const admin = await this.findByEmail(email);
    if (!admin) return false;
    return bcrypt.compare(password, admin.password);
  }

  /**
   * Update password
   */
  static async updatePassword(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE "Admins-Login"
         SET password = $1, updated_at = CURRENT_TIMESTAMP
         WHERE email = $2
         RETURNING email, updated_at`,
        [hashedPassword, email.toLowerCase().trim()]
      );

      if (result.rows.length === 0) {
        return { error: 'Email not found' };
      }

      return { success: true, message: 'Password updated', data: result.rows[0] };
    } finally {
      client.release();
    }
  }
}

export default AdminModel;
