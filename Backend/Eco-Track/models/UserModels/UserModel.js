import pool from '../../config/db.js'; 
import bcrypt from 'bcryptjs';

class UserModel {
  static async register(email, password) {
    if (!email || !password) return { error: 'Email and password are required' };
    const client = await pool.connect();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await client.query(
        `INSERT INTO "Users-Login" (email, password)
         VALUES ($1, $2)
         RETURNING id, email, created_at`,
        [email.toLowerCase().trim(), hashedPassword]
      );
      return { success: true, user: result.rows[0] };
    } catch (err) {
      if (err.code === '23505') return { error: 'Email already registered' };
      return { error: 'Registration failed', details: err.message };
    } finally {
      client.release();
    }
  }

  static async findByEmail(email) {
    if (!email) throw new Error("Email is required in findByEmail");
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

  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

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
      if (result.rows.length === 0) return { error: 'Email not found' };
      return { success: true, message: 'Password updated', data: result.rows[0] };
    } finally {
      client.release();
    }
  }
}

export default UserModel;
