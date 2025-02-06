require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 3000;

// Import MenuItem model
const MenuItem = require("./models/MenuItem");

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("✅ API is running!");
});

// ✅ UPDATE (PUT) - Update a menu item
app.put("/menu/:id", async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { name, description, price },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "❌ Menu item not found" });
        }

        res.json({ message: "✅ Menu item updated", updatedItem });
    } catch (error) {
        res.status(500).json({ message: "❌ Error updating menu item", error });
    }
});

// ✅ DELETE - Remove a menu item
app.delete("/menu/:id", async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: "❌ Menu item not found" });
        }

        res.json({ message: "✅ Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error deleting menu item", error });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
