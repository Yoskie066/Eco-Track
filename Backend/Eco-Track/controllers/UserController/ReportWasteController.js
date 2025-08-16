import ReportWasteModel from '../../models/UserModels/ReportWasteModel.js';
import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';

class ReportWasteController {
  // Controller method for adding a reported waste record
  static async addReport(req, res) {
    try {
      // Spread all request body data into reportData
      const reportData = { ...req.body };

      // Attach the logged-in user's email (from authentication middleware)
      reportData.userEmail = req.user.email;

      // If there is an uploaded file, upload it to Cloudinary
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'eco_track_uploads',
        });

        reportData.photoUrl = uploadResult.secure_url;

        fs.unlinkSync(req.file.path);
      }

      // Call the model function to insert the data into the database
      const result = await ReportWasteModel.addReport(reportData);

      // Send success response to client
      res.status(201).json({
        success: true,
        message: 'Waste reported successfully',
        id: result.id, 
      });
    } catch (error) {
      // Log and send error response
      console.error("Error inserting waste report:", error.message);
      res.status(500).json({ success: false, message: "Failed to report waste", error: error.message });
    }
  }

  static async getUserReports(req, res) {
    // Controller method for retrieving waste records of the logged-in user
    try {
      // Get the logged-in user's email
      const email = req.user.email;

      // Fetch waste records from the database based on the user's email
      const reports = await ReportWasteModel.getUserReports(email);

      if (reports.length === 0) {
        return res.status(404).json({ success: false, message: 'No waste reports found' });
      }

      // Remove userEmail field from each record before sending response
      const filteredReports = reports.map(({ useremail, ...rest }) => rest);

      // Send response with waste records
      res.json({ success: true, data: filteredReports });
    } catch (error) {
      // Log and send error response
      console.error('Error fetching waste reports:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch waste reports' });
    }
  }
}

export default ReportWasteController;