import CollectWasteModel from '../../models/UserModels/CollectWasteModel.js';
import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';

class CollectWasteController {
  static async addWaste(req, res) {
    try {
      const wasteData = { ...req.body };

      // Email ng naka-login user (pang-save lang sa DB, hindi ibabalik sa JSON)
      wasteData.userEmail = req.user.email;

      // Kung may kasamang file, i-upload sa Cloudinary
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'eco_track_uploads',
        });

        wasteData.photoUrl = uploadResult.secure_url;

        // Burahin ang temporary file mula local storage
        fs.unlinkSync(req.file.path);
      }

      const result = await CollectWasteModel.addWaste(wasteData);

      res.status(201).json({
        success: true,
        message: 'Waste collected successfully',
        id: result.id,
      });
    } catch (error) {
      console.error("Error inserting collect waste:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to collect waste",
        error: error.message
      });
    }
  }

  static async getUserWaste(req, res) {
    try {
      const email = req.user.email;
      const wastes = await CollectWasteModel.getUserWaste(email);

      if (wastes.length === 0) {
        return res.status(404).json({ success: false, message: 'No collected waste found' });
      }

      // Alisin ang userEmail field bago ibalik
      const filteredWastes = wastes.map(({ useremail, ...rest }) => rest);

      res.json({ success: true, data: filteredWastes });
    } catch (error) {
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
