import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import AdminModel from '../../models/AdminModels/AdminModel.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

// Generate JWT tokens
function generateAccessToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, REFRESH_TOKEN_SECRET, { expiresIn: '25y' });
}

class AdminController {
  // REGISTER
  static async register(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

      const result = await AdminModel.register(email, password);
      if (result.error) return res.status(400).json({ error: result.error, details: result.details || '' });

      res.status(201).json({ message: 'Admin registered successfully', adminId: result.admin.id });
    } catch (err) {
      console.error('Admin Register Error:', err);
      res.status(500).json({ error: 'Server error during registration', details: err.message });
    }
  }

  // LOGIN
  static async login(req, res) {
  const { email, password } = req.body;
  console.log(">> Email from request:", email);
  console.log(">> Password from request:", password);

  try {
    const admin = await AdminModel.findByEmail(email);
    console.log(">> Admin from DB:", admin);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials (no admin found)' });
    }

    if (!admin.password) {
      return res.status(500).json({ error: 'No password hash found in DB for this admin' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials (wrong password)' });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    // Save refresh token in DB
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2)`,
        [refreshToken, admin.id]
      );
    } finally {
      client.release();
    }

    res.status(200).json({ message: 'Admin login successful', accessToken, refreshToken });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ error: 'Server error during login', details: err.message });
  }
}


  // FORGOT PASSWORD
  static async forgotPassword(req, res) {
    const { email, newPassword } = req.body;
    try {
      const admin = await AdminModel.findByEmail(email);
      if (!admin) return res.status(404).json({ error: 'Email not found' });

      const isSamePassword = await bcrypt.compare(newPassword, admin.password);
      if (isSamePassword) return res.status(400).json({ error: 'New password cannot be the same as old password' });

      await AdminModel.updatePassword(email, newPassword);
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error('Admin Reset Password Error:', err);
      res.status(500).json({ error: 'Server error during password reset' });
    }
  }

  // REFRESH TOKEN
  static async refreshToken(req, res) {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'Refresh token required' });

    try {
      const client = await pool.connect();
      const result = await client.query(
        `SELECT * FROM refresh_tokens WHERE token = $1`,
        [token]
      );
      client.release();

      if (result.rows.length === 0) return res.status(403).json({ error: 'Invalid or revoked refresh token' });

      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
      const accessToken = generateAccessToken(decoded);
      res.status(200).json({ accessToken });
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  }

  // PROFILE
  static async profile(req, res) {
    try {
      const admin = await AdminModel.findByEmail(req.user.email);
      if (!admin) return res.status(404).json({ error: 'Admin not found' });

      res.status(200).json({
        id: admin.id,
        email: admin.email,
        role: 'admin',
        created_at: admin.created_at
      });
    } catch (err) {
      console.error('Admin Profile Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export default AdminController;
