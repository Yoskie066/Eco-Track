import CollectedWasteModel from "../../models/AdminModels/CollectedWasteModel.js";

class CollectedWasteController {
  static async getAll(req, res) {
    try {
      const data = await CollectedWasteModel.getAll();
      console.log("Collected waste from DB:", data);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch collected waste", error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await CollectedWasteModel.getById(id);
      if (!data) return res.status(404).json({ success: false, message: "Collected waste not found" });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch collected waste by ID", error: error.message });
    }
  }

  // PUT - Update collected waste by ID (lahat ng fields)
  static async updateCollectedWaste(req, res) {
    try {
      const { id } = req.params;
      const { useremail, wastename, category, subcategory, quantity, unit, datecollected, description, photourl } = req.body;

      const updatedWaste = await CollectedWasteModel.update(id, {
        useremail,
        wastename,
        category,
        subcategory,
        quantity,
        unit,
        datecollected,
        description,
        photourl,
      });

      if (!updatedWaste) {
        return res.status(404).json({ success: false, message: "Collected waste not found" });
      }

      res.json({ success: true, message: "Collected waste updated successfully", data: updatedWaste });
    } catch (error) {
      console.error("Error updating collected waste:", error);
      res.status(500).json({ success: false, message: "Failed to update collected waste" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await CollectedWasteModel.delete(id);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete collected waste", error: error.message });
    }
  }
}

export default CollectedWasteController;
