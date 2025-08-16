import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminModel from '../../models/AdminModels/AdminModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

class AdminController {
  // REGISTER
  static async register(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await AdminModel.register(email, password);

      if (result.error) {
        return res.status(400).json({
          error: result.error,
          details: result.details || ''
        });
      }

      res.status(201).json({
        message: 'Admin registered successfully',
        adminId: result.admin.id
      });
    } catch (err) {
      console.error('Admin Register Error:', err);
      res.status(500).json({
        error: 'Server error during registration',
        details: err.message
      });
    }
  }

  // LOGIN
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const admin = await AdminModel.findByEmail(email);

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Admin login successful', token });
    } catch (err) {
      console.error('Admin Login Error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  }

  // FORGOT PASSWORD
  static async forgotPassword(req, res) {
    const { email, newPassword } = req.body;
    try {
      const admin = await AdminModel.findByEmail(email);
      if (!admin) {
        return res.status(404).json({ error: 'Email not found' });
      }

      const isSamePassword = await bcrypt.compare(newPassword, admin.password);
      if (isSamePassword) {
        return res.status(400).json({ error: 'New password cannot be the same as old password' });
      }

      await AdminModel.updatePassword(email, newPassword);

      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error('Admin Reset Password Error:', err);
      res.status(500).json({ error: 'Server error during password reset' });
    }
  }

  // REFRESH TOKEN
  static async refreshToken(req, res) {
    res.status(200).json({ message: 'Admin refresh token endpoint hit (placeholder)' });
  }
}

export default AdminController;
