import ReportWasteModel from '../../models/UserModels/ReportWasteModel.js';
import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';

class ReportWasteController {
  // Add reported waste
  static async addReport(req, res) {
    try {
      const reportData = { ...req.body };
      reportData.userEmail = req.user?.email || "testuser@example.com";

      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'eco_track_uploads' });
        reportData.photoUrl = uploadResult.secure_url;
        fs.unlinkSync(req.file.path);
      }

      const result = await ReportWasteModel.addReport(reportData);

      res.status(201).json({
        success: true,
        message: 'Waste reported successfully',
        id: result.id
      });
    } catch (error) {
      console.error("Error inserting report waste:", error.message);
      res.status(500).json({ success: false, message: "Failed to report waste", error: error.message });
    }
  }

  // Update reported waste
  static async updateReport(req, res) {
    try {
      const { id } = req.params;
      const reportData = { ...req.body };

      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'eco_track_uploads' });
        reportData.photoUrl = uploadResult.secure_url;
        fs.unlinkSync(req.file.path);
      }

      const updated = await ReportWasteModel.updateReport(id, reportData);
      if (!updated) return res.status(404).json({ success: false, message: "Report not found" });

      res.json({ success: true, message: "Report updated successfully", data: updated });
    } catch (error) {
      console.error("Error updating report waste:", error.message);
      res.status(500).json({ success: false, message: "Failed to update report waste", error: error.message });
    }
  }

  // Delete reported waste
  static async deleteReport(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ReportWasteModel.deleteReport(id);
      if (!deleted) return res.status(404).json({ success: false, message: "Report not found" });

      res.json({ success: true, message: "Report deleted successfully", data: deleted });
    } catch (error) {
      console.error("Error deleting report waste:", error.message);
      res.status(500).json({ success: false, message: "Failed to delete report waste", error: error.message });
    }
  }

  // Get user reported waste
  static async getUserReports(req, res) {
    try {
      const email = req.user.email;
      const reports = await ReportWasteModel.getUserReports(email);

      // remove userEmail field if you don’t want to expose it
      const filtered = reports.map(({ useremail: _, ...rest }) => rest);

      res.json({ success: true, data: filtered });
    } catch (error) {
      console.error('Error fetching reported waste:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch reported waste', error: error.message });
    }
  }

  // Get report by ID
  static async getReportById(req, res) {
    try {
      const { id } = req.params;
      const report = await ReportWasteModel.getReportById(id);
      if (!report) return res.status(404).json({ success: false, message: "Report not found" });

      res.json({ success: true, data: report });
    } catch (error) {
      console.error('Error fetching report:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch report', error: error.message });
    }
  }
}

export default ReportWasteController;
