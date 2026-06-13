import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Device, Ticket } from "./models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/biomed";

let dbConnected = false;

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    dbConnected = true;
    console.log("MongoDB connected in BE");
  })
  .catch(err => {
    console.error("MongoDB connection blocked/failed. Using local JSON fallback.");
  });

// Fallback logic
const DB_DEVICES = path.join(__dirname, "local_db.json");
const DB_TICKETS = path.join(__dirname, "local_db_tickets.json");

const readLocal = (file) => {
  try { if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf-8")); } catch (e) {}
  return [];
};
const writeLocal = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// --- DEVICES API ---
app.get("/api/devices", async (req, res) => {
  try {
    const { tenantId, role } = req.query;
    if (dbConnected) {
      let query = {};
      if (role === "tenant") query.tenantId = tenantId;
      else if (role === "vendor") return res.json({ data: [] });
      const devices = await Device.find(query).sort({ createdAt: -1 });
      return res.json({ data: devices });
    } else {
      let devices = readLocal(DB_DEVICES);
      if (role === "tenant") devices = devices.filter(d => d.tenantId === tenantId);
      return res.json({ data: devices });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/devices", async (req, res) => {
  try {
    const { devicesToInsert } = req.body;
    if (dbConnected) {
      const result = await Device.insertMany(devicesToInsert);
      return res.status(201).json({ data: result });
    } else {
      const existing = readLocal(DB_DEVICES);
      writeLocal(DB_DEVICES, [...devicesToInsert, ...existing]);
      return res.status(201).json({ data: devicesToInsert });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- TICKETS API ---
app.get("/api/tickets", async (req, res) => {
  try {
    const { tenantId, role } = req.query;
    if (dbConnected) {
      let query = {};
      if (role === "tenant") query.hospitalId = tenantId;
      else if (role === "vendor") query.assignedVendorId = tenantId;
      const tickets = await Ticket.find(query)
        .populate("deviceId", "name serialNumber location model")
        .populate("assignedVendorId", "name email")
        .populate("hospitalId", "name hospital")
        .sort({ createdAt: -1 });
      return res.json({ data: tickets });
    } else {
      let tickets = readLocal(DB_TICKETS);
      if (role === "tenant") tickets = tickets.filter(t => t.hospitalId === tenantId);
      return res.json({ data: tickets });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tickets", async (req, res) => {
  try {
    const { ticket, deviceId } = req.body;
    if (dbConnected) {
      const newTicket = await Ticket.create(ticket);
      await Device.findByIdAndUpdate(deviceId, { status: "malfunctioning" });
      return res.status(201).json({ data: newTicket });
    } else {
      const existing = readLocal(DB_TICKETS);
      writeLocal(DB_TICKETS, [ticket, ...existing]);
      return res.status(201).json({ data: ticket });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
