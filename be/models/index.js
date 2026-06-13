import mongoose from "mongoose";

// --- USER MODEL ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["vendor", "admin", "tenant"], default: "tenant" },
  hospital: String,
  area: String,
  location: String,
  pincode: String,
  image: String,
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);

// --- DEVICE MODEL ---
const deviceSchema = new mongoose.Schema({
  name: String,
  department: String,
  make: String,
  model: String,
  serialNumber: { type: String, unique: true },
  hospitalName: String,
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  purchaseDate: Date,
  lastServiceDate: Date,
  nextServiceDate: Date, // For PM (6-month rule)
  calibDueDate: Date,
  status: { type: String, enum: ["operational", "malfunctioning", "under-repair", "condemned", "offline"], default: "operational" },
  location: String, // e.g., "ICU Room 302"
}, { timestamps: true });

export const Device = mongoose.models.Device || mongoose.model("Device", deviceSchema);

// --- TICKET MODEL ---
const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  errorCode: String,
  priority: { type: String, enum: ["low", "normal", "high", "critical"], default: "normal" },
  status: { type: String, enum: ["received", "assigned", "in-progress", "in-repair", "completed"], default: "received" },
  media: [String], // S3 or Cloudinary URLs
  companyName: String, // Service provider/vendor company
  vendorName: String,
  vendorContact: String,
  assignedVendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resolutionNotes: String,
  signature: String, // Base64 signature
  completionDate: Date,
}, { timestamps: true });

export const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
