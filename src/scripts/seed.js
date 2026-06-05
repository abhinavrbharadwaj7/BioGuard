const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

// Schemas (copied directly for standalone script execution)
const userSchema = new mongoose.Schema({
  name: String, email: String, passwordHash: String, role: String, hospital: String, image: String
}, { timestamps: true });

const deviceSchema = new mongoose.Schema({
  name: String, model: String, serialNumber: String, hospitalName: String, 
  tenantId: mongoose.Schema.Types.ObjectId, purchaseDate: Date, 
  lastServiceDate: Date, nextServiceDate: Date, status: String, location: String
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
  deviceId: mongoose.Schema.Types.ObjectId, hospitalId: mongoose.Schema.Types.ObjectId,
  description: String, errorCode: String, priority: String, status: String, media: [String],
  assignedVendorId: mongoose.Schema.Types.ObjectId, resolutionNotes: String, signature: String, completionDate: Date
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Device = mongoose.models.Device || mongoose.model("Device", deviceSchema);
const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

const TENANT_ID = "60d5ecb8b392d700153ee101";
const ADMIN_ID = "60d5ecb8b392d700153ee102";
const VENDOR_ID = "60d5ecb8b392d700153ee103";
const OTHER_VENDOR_ID = new mongoose.Types.ObjectId();

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB. Wiping existing data...");
    
    await User.deleteMany({});
    await Device.deleteMany({});
    await Ticket.deleteMany({});

    console.log("Seeding Users...");
    await User.create([
      { _id: TENANT_ID, name: "Hospital IT Admin", email: "tenant@demo.com", role: "tenant", passwordHash: "bypass", hospital: "General Hospital" },
      { _id: ADMIN_ID, name: "Dispatch Control", email: "admin@demo.com", role: "admin", passwordHash: "bypass" },
      { _id: VENDOR_ID, name: "Field Engineer", email: "vendor@demo.com", role: "vendor", passwordHash: "bypass" },
      { _id: OTHER_VENDOR_ID, name: "Sarah Connor (Vendor)", email: "sarah@vendor.com", role: "vendor", passwordHash: "bypass" }
    ]);

    console.log("Seeding Devices...");
    const devices = await Device.create([
      { name: "GE MRI Scanner v3", model: "Signa Pioneer", serialNumber: "GE-98122", hospitalName: "General Hospital", tenantId: TENANT_ID, location: "ICU Room 302", status: "under-repair", nextServiceDate: new Date(Date.now() + 86400000 * 30) },
      { name: "Philips Patient Monitor", model: "IntelliVue MX800", serialNumber: "PH-11029", hospitalName: "General Hospital", tenantId: TENANT_ID, location: "Radiology", status: "operational", nextServiceDate: new Date(Date.now() + 86400000 * 15) },
      { name: "Maquet Ventilator", model: "Servo-u", serialNumber: "MQ-44211", hospitalName: "General Hospital", tenantId: TENANT_ID, location: "Emergency", status: "operational", nextServiceDate: new Date(Date.now() + 86400000 * 5) },
      { name: "Stryker Bed", model: "ProCuity", serialNumber: "ST-77821", hospitalName: "General Hospital", tenantId: TENANT_ID, location: "Ward 4", status: "operational", nextServiceDate: new Date(Date.now() + 86400000 * 60) },
    ]);

    console.log("Seeding Tickets...");
    await Ticket.create([
      { deviceId: devices[0]._id, hospitalId: TENANT_ID, description: "Cooling system failure", errorCode: "ERR_CL_101", priority: "critical", status: "in-repair", assignedVendorId: VENDOR_ID },
      { deviceId: devices[1]._id, hospitalId: TENANT_ID, description: "Screen flickering", errorCode: "DISP_02", priority: "normal", status: "assigned", assignedVendorId: VENDOR_ID },
      { deviceId: devices[2]._id, hospitalId: TENANT_ID, description: "Routine PM Check", priority: "low", status: "received" },
      { deviceId: devices[3]._id, hospitalId: TENANT_ID, description: "Rail lock stuck", priority: "high", status: "assigned", assignedVendorId: OTHER_VENDOR_ID }
    ]);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
