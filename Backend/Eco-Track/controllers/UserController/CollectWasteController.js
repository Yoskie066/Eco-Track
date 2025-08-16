import CollectWasteModel from '../../models/UserModels/CollectWasteModel.js';
import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';

class CollectWasteController {
  // Controller method for adding a collected waste record
  static async addWaste(req, res) {
    try {
      // Spread all request body data into wasteData
      const wasteData = { ...req.body };
      
       // Attach the logged-in user's email (from authentication middleware)
      wasteData.userEmail = req.user.email;

      // If there is an uploaded file, upload it to Cloudinary
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'eco_track_uploads',
        });

        wasteData.photoUrl = uploadResult.secure_url;

        fs.unlinkSync(req.file.path);
      }

      // Call the model function to insert the data into the database
      const result = await CollectWasteModel.addWaste(wasteData);

      // Send success response to client
      res.status(201).json({
        success: true,
        message: 'Waste collected successfully',
        id: result.id,
      });
    } catch (error) {
       // Log and send error response
      console.error("Error inserting collect waste:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to collect waste",
        error: error.message
      });
    }
  }

  static async getUserWaste(req, res) {
    // Controller method for retrieving waste records of the logged-in user
    try {
      // Get the logged-in user's email
      const email = req.user.email;

      // Fetch waste records from the database based on the user's email
      const wastes = await CollectWasteModel.getUserWaste(email);

      if (wastes.length === 0) {
        return res.status(404).json({ success: false, message: 'No collected waste found' });
      }

      // Remove userEmail field from each record before sending response
      const filteredWastes = wastes.map(({ useremail, ...rest }) => rest);

      // Send response with waste records
      res.json({ success: true, data: filteredWastes });
    } catch (error) {
      // Log and send error response
      console.error('Error fetching collected waste:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch collected waste',
        error: error.message
      });
    }
  }
}

export default CollectWasteController;
