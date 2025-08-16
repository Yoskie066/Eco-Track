import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/UserModels/UserModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

class UserController {
  //Register
  static async register(req, res) {
  const { email, password } = req.body;
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await UserModel.register(email, password);
    
    if (result.error) {
      return res.status(400).json({ 
        error: result.error,
        details: result.details || ''
      });
    }

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.user.id 
    });
  } catch (err) {
    console.error('Register Controller Error:', err);
    res.status(500).json({ 
      error: 'Server error during registration',
      details: err.message });
    }
  }

  // LOGIN
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      // Use UserModel instead of direct pool query
      const user = await UserModel.findByEmail(email);

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

  // FORGOT PASSWORD
  static async forgotPassword(req, res) {
    const { email, newPassword } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      }

      // Check if new password is same as old password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ error: 'New password cannot be the same as old password' });
      }

      // Use UserModel method instead of direct query
      await UserModel.updatePassword(email, newPassword);
      
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error('Reset Password Error:', err);
      res.status(500).json({ error: 'Server error during password reset' });
    }
  }

  // REFRESH TOKEN
  static async refreshToken(req, res) {
    res.status(200).json({ message: 'Refresh token endpoint hit (placeholder)' });
  }
}

export default UserController;