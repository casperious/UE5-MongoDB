
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

MONGO_URI = "mongodb+srv://jvarghese2:Jv9109!1234@cluster0.3hswi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
PORT = 5000;

// Initialize Express
const app = express();
//const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Define Schema
const DataSchema = new mongoose.Schema({
    taskID: String,
    startTime: Number,
    endTime: Number,
    steps: Number,
    gaitSpeed: Number,
    timestamp: { type: Date, default: Date.now },
});

const DataModel = mongoose.model("Data", DataSchema);

// API Route for UE5 to Send Data
app.post("/data", async (req, res) => {
    try {
        const { taskID, startTime, endTime, steps, gaitSpeed } = req.body;
        const newData = new DataModel({ taskID, startTime, endTime, steps, gaitSpeed });
        await newData.save();
        res.status(201).json({ message: "Data saved", data: newData });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
