import ReportedWasteModel from "../../models/AdminModels/ReportedWasteModel.js";

class ReportedWasteController {
  static async getAll(req, res) {
    try {
      const data = await ReportedWasteModel.getAll();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch reported waste", error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await ReportedWasteModel.getById(id);
      if (!data) return res.status(404).json({ success: false, message: "Reported waste not found" });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch reported waste by ID", error: error.message });
    }
  }

  static async updateReportedWaste(req, res) {
    try {
      const { id } = req.params;
      const { useremail, wastename, category, subcategory, color, location, datereported, description, photourl } = req.body;

      const updated = await ReportedWasteModel.update(id, {
        useremail, wastename, category, subcategory, color, location, datereported, description, photourl
      });

      if (!updated) return res.status(404).json({ success: false, message: "Reported waste not found" });

      res.json({ success: true, message: "Reported waste updated successfully", data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update reported waste", error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ReportedWasteModel.delete(id);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete reported waste", error: error.message });
    }
  }
}

export default ReportedWasteController;