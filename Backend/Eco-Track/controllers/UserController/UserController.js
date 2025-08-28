import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import UserModel from '../../models/UserModels/UserModel.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '25y' });
}

class UserController {
  static async register(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

      const result = await UserModel.register(email, password);
      if (result.error) return res.status(400).json({ error: result.error, details: result.details || '' });

      res.status(201).json({ message: 'User registered successfully', userId: result.user.id });
    } catch (err) {
      res.status(500).json({ error: 'Server error during registration', details: err.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      // Save refresh token in DB
      const client = await pool.connect();
      try {
        await client.query(
          `INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2)`,
          [refreshToken, user.id]
        );
      } finally {
        client.release();
      }
  
      res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
    } catch (err) {
      console.error("DB Insert Error:", err);
      res.status(500).json({ error: 'Server error during login', details: err.message });
    }
  }
  
  
    static async forgotPassword(req, res) {
      const { email, newPassword } = req.body;
      try {
        const user = await UserModel.findByEmail(email);
        if (!user) return res.status(404).json({ error: 'Email not found' });
  
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) return res.status(400).json({ error: 'New password cannot be the same as old password' });
  
        await UserModel.updatePassword(email, newPassword);
        res.status(200).json({ message: 'Password reset successful' });
      } catch (err) {
        res.status(500).json({ error: 'Server error during password reset' });
      }
    }
  
    static async refreshToken(req, res) {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'Refresh token required' });
  
    try {
      // Check if token exists in DB
      const client = await pool.connect();
      const result = await client.query(
        `SELECT * FROM refresh_tokens WHERE token = $1`,
        [token]
      );
      client.release();
  
      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Invalid or revoked refresh token' });
      }
  
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
      const accessToken = generateAccessToken(decoded);
      res.status(200).json({ accessToken });
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  }

  static async profile(req, res) {
  try {
    // User Profile
    const user = await UserModel.findByEmail(req.user.email);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ 
      id: user.id,
      email: user.email,
      created_at: user.created_at
    });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
}

export default UserController;
