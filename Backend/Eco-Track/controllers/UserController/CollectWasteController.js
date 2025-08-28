import CollectWasteModel from '../../models/UserModels/CollectWasteModel.js';
import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';

class CollectWasteController {
  // Add collected waste
  static async addWaste(req, res) {
    try {
      const wasteData = { ...req.body };
      wasteData.userEmail = req.user?.email || "testuser@example.com";

      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'eco_track_uploads' });
        wasteData.photoUrl = uploadResult.secure_url;
        fs.unlinkSync(req.file.path);
      }

      const result = await CollectWasteModel.addWaste(wasteData);

      res.status(201).json({
        success: true,
        message: 'Waste collected successfully',
        id: result.id
      });
    } catch (error) {
      console.error("Error inserting collect waste:", error.message);
      res.status(500).json({ success: false, message: "Failed to collect waste", error: error.message });
    }
  }

  // Update collected waste
  static async updateWaste(req, res) {
    try {
      const { id } = req.params;
      const wasteData = { ...req.body };

      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'eco_track_uploads' });
        wasteData.photoUrl = uploadResult.secure_url; // FIXED casing
        fs.unlinkSync(req.file.path);
      }

      const updated = await CollectWasteModel.updateWaste(id, wasteData);
      if (!updated) return res.status(404).json({ success: false, message: "Waste not found" });

      res.json({ success: true, message: "Waste updated successfully", data: updated });
    } catch (error) {
      console.error("Error updating waste:", error.message);
      res.status(500).json({ success: false, message: "Failed to update waste", error: error.message });
    }
  }

  // Delete collected waste
  static async deleteWaste(req, res) {
    try {
      const { id } = req.params;
      const deleted = await CollectWasteModel.deleteWaste(id);
      if (!deleted) return res.status(404).json({ success: false, message: "Waste not found" });

      res.json({ success: true, message: "Waste deleted successfully", data: deleted });
    } catch (error) {
      console.error("Error deleting waste:", error.message);
      res.status(500).json({ success: false, message: "Failed to delete waste", error: error.message });
    }
  }

  // Get user collected waste
  static async getUserWaste(req, res) {
    try {
      const email = req.user.email;
      const wastes = await CollectWasteModel.getUserWaste(email);

      // remove userEmail field if you don’t want to expose it
      const filtered = wastes.map(({ useremail: _, ...rest }) => rest);

      res.json({ success: true, data: filtered });
    } catch (error) {
      console.error('Error fetching collected waste:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch collected waste', error: error.message });
    }
  }
}

export default CollectWasteController;
