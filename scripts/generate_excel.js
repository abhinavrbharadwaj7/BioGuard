const XLSX = require("xlsx");
const fs = require("fs");

const generateData = () => {
  const devices = [];
  const locations = ["ICU Room 1", "ER Bay 3", "OR 2", "General Ward A", "NICU", "Radiology", "Cardiology", "Outpatient"];
  const makes = ["Philips", "GE Healthcare", "Siemens Healthineers", "Dräger", "Medtronic", "Mindray"];
  const deviceNames = [
    "Patient Monitor", "Ventilator", "Defibrillator", "Infusion Pump", 
    "ECG Machine", "Anesthesia Machine", "Ultrasound Scanner", 
    "Syringe Pump", "Dialysis Machine", "CPAP Machine"
  ];

  for (let i = 1; i <= 20; i++) {
    const make = makes[Math.floor(Math.random() * makes.length)];
    const deviceName = deviceNames[Math.floor(Math.random() * deviceNames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const serialNumber = `SN-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Purchase date between 2018 and 2023
    const purchaseYear = 2018 + Math.floor(Math.random() * 6);
    const purchaseMonth = Math.floor(Math.random() * 12) + 1;
    const purchaseDate = `${purchaseYear}-${purchaseMonth.toString().padStart(2, '0')}-01`;
    
    // Next PM date between 2026-07-01 and 2026-12-31
    const nextPmMonth = Math.floor(Math.random() * 6) + 7; 
    const nextPmDate = `2026-${nextPmMonth.toString().padStart(2, '0')}-15`;

    devices.push({
      "Device Name": `${make} ${deviceName}`,
      "Serial Number": serialNumber,
      "Location / Ward": location,
      "Purchase Date": purchaseDate,
      "Next PM Date": nextPmDate,
      "Department": location.includes("ICU") ? "Intensive Care" : location.includes("ER") ? "Emergency" : "General",
      "Make": make,
      "Model": `${deviceName.split(" ")[0].substring(0,3).toUpperCase()}-2000`
    });
  }
  return devices;
};

const data = generateData();
const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Devices");

XLSX.writeFile(workbook, "./public/bioguard_bulk_import_sample.xlsx");
console.log("Excel file generated successfully at ./public/bioguard_bulk_import_sample.xlsx");
