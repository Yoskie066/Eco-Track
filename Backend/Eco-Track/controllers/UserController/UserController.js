import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

class UserController {
  // 🔐 REGISTER
  static async register(req, res) {
  const { email, password } = req.body;
  try {
    // Check if email exists
    const userExists = await pool.query('SELECT * FROM "Users-Login" WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert and return new user ID
    const result = await pool.query(
      'INSERT INTO "Users-Login" (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );

    const newUserId = result.rows[0].id;

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: newUserId 
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
}

  // 🔐 LOGIN
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM "Users-Login" WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  }

 // 🔐 FORGOT PASSWORD
static async forgotPassword(req, res) {
  const { email, newPassword } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "Users-Login" WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // ✅ Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, result.rows[0].password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password cannot be the same as old password' });
    }

    // ✅ Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE "Users-Login" SET password = $1 WHERE email = $2', [hashedPassword, email]);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: 'Server error during password reset' });
  }
}

  // 🔁 REFRESH TOKEN (placeholder lang)
  static async refreshToken(req, res) {
    res.status(200).json({ message: 'Refresh token endpoint hit (placeholder)' });
  }
}

export default UserController;
