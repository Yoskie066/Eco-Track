import pool from '../../config/db.js'; 
import bcrypt from 'bcryptjs';


class UserModel {
  /**
   * Initialize Users-Login table
   */
  static async init() {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Users-Login" (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Users-Login table ready');
    } finally {
      client.release();
    }
  }

  /**
   * Register a new user
   */
  static async register(email, password) {
    const client = await pool.connect();
    try {
      const userExists = await client.query(
        `SELECT * FROM "Users-Login" WHERE email = $1`,
        [email.toLowerCase().trim()]
      );

      if (userExists.rows.length > 0) {
        return { error: 'Email already registered' };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await client.query(
        `INSERT INTO "Users-Login" (email, password)
         VALUES ($1, $2)
         RETURNING id, email, created_at`,
        [email.toLowerCase().trim(), hashedPassword]
      );

      return { success: true, user: result.rows[0] };
    } catch (err) {
      return { error: 'Registration failed', details: err.message };
    } finally {
      client.release();
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM "Users-Login" WHERE email = $1',
        [email.toLowerCase().trim()]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Verify user password (for login)
   */
  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

  /**
   * Update password (used for forgot password)
   */
  static async updatePassword(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE "Users-Login"
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

// Auto-init the table
UserModel.init().catch(console.error);

export default UserModel;