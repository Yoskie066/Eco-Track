import express from 'express';
import dotenv from 'dotenv';
import initDb from './database/initDb.js';
import cookieParser from 'cookie-parser';
import UserRoutes from './routes/UserRoutes/UserRoutes.js'; 

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Initialize database and start server
const startServer = async () => {
  try {
    await initDb();
    console.log('Database initialized');
    
    // Use UserRoutes for all user-related endpoints
    app.use('/api/users', UserRoutes);

    // Sample route
    app.get('/', (req, res) => {
      res.send('EcoTrack API is running...');
    });

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();