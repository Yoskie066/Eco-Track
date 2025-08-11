import ReportWasteModel from '../../models/UserModels/ReportWasteModel.js';
import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';

class ReportWasteController {
  static async addReport(req, res) {
    try {
      const reportData = { ...req.body };

      // Email ng naka-login user (pang-save lang sa DB, hindi ibabalik sa JSON)
      reportData.userEmail = req.user.email;

      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'eco_track_uploads',
        });

        reportData.photoUrl = uploadResult.secure_url;

        // Burahin local file
        fs.unlinkSync(req.file.path);
      }

      const result = await ReportWasteModel.addReport(reportData);

      res.status(201).json({
        success: true,
        message: 'Waste reported successfully',
        id: result.id, // ID lang ng bagong report
      });
    } catch (error) {
      console.error("Error inserting waste report:", error.message);
      res.status(500).json({ success: false, message: "Failed to report waste", error: error.message });
    }
  }

  static async getUserReports(req, res) {
    try {
      const email = req.user.email;
      const reports = await ReportWasteModel.getUserReports(email);

      if (reports.length === 0) {
        return res.status(404).json({ success: false, message: 'No waste reports found' });
      }

      // Alisin ang userEmail field sa bawat report bago ibalik
      const filteredReports = reports.map(({ useremail, ...rest }) => rest);

      res.json({ success: true, data: filteredReports });
    } catch (error) {
      console.error('Error fetching waste reports:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch waste reports' });
    }
  }
}

export default ReportWasteController;