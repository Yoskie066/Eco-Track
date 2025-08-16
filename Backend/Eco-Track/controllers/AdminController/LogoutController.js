import pool from '../../config/db.js';
import jwt from 'jsonwebtoken';

/**
 * Logs out a user by blacklisting their JWT token.
 */
const logoutAdmin = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token not provided' });
    }

    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Add token to blacklist
    await pool.query(
      `INSERT INTO revoked_tokens (token, expires_at) VALUES ($1, to_timestamp($2))`,
      [token, decoded.exp]
    );

    res.status(200).json({ success: true, message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ success: false, message: 'Server error during logout', error: error.message });
  }
};

export default logoutAdmin;
