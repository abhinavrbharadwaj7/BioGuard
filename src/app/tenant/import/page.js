"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  ArrowRight, 
  ArrowLeft,
  FileSpreadsheet,
  CheckCircle2,
  Database,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";

const TARGET_FIELDS = [
  { id: "name", label: "Device Name", required: true },
  { id: "serialNumber", label: "Serial Number", required: true },
  { id: "location", label: "Location / Ward", required: true },
  { id: "department", label: "Department", required: false },
  { id: "make", label: "Make", required: false },
  { id: "model", label: "Model", required: false },
  { id: "purchaseDate", label: "Purchase Date", required: false },
  { id: "nextServiceDate", label: "Next PM Date", required: false },
];

export default function BulkImportPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [mapping, setMapping] = useState({});
  const [previewData, setPreviewData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      if (data.length > 0) {
        setHeaders(data[0] || []);
        setRawData(data.slice(1).filter(row => row.length > 0)); // Get all rows
        setStep(2);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleMappingChange = (targetField, excelHeaderIndex) => {
    setMapping(prev => ({
      ...prev,
      [targetField]: excelHeaderIndex
    }));
  };

  const generatePreview = () => {
    // Validate required fields
    const missingRequired = TARGET_FIELDS.filter(f => f.required && mapping[f.id] === undefined);
    if (missingRequired.length > 0) {
      alert(`Please map all required fields: ${missingRequired.map(f => f.label).join(", ")}`);
      return;
    }

    const mappedPreview = rawData.map(row => {
      const mappedRow = {};
      TARGET_FIELDS.forEach(field => {
        const colIndex = mapping[field.id];
        mappedRow[field.id] = colIndex !== undefined ? row[colIndex] : "";
      });
      return mappedRow;
    });

    setPreviewData(mappedPreview);
    setStep(3);
  };

  const executeImport = async () => {
    setIsProcessing(true);
    
    try {
      const isDemo = typeof window !== "undefined" && window.location.search.includes("demo=1");
      const url = isDemo ? "/api/devices?demo=1" : "/api/devices";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devices: previewData })
      });
      
      if (res.ok) {
        setStep(4);
      } else {
        const errorData = await res.json();
        alert(`Import failed: ${errorData.error || "Serial numbers might be duplicated."}`);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during import.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 pb-20">
      <Link href="/tenant" className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors group font-medium w-fit">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 border border-blue-100">
          <Database className="text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Bulk Asset Import</h2>
          <p className="text-slate-500">Map your legacy CMMS exports directly into BioGuard</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex flex-col gap-2">
            <div className={`h-1.5 rounded-full transition-colors duration-500 ${step >= s ? 'bg-primary' : 'bg-slate-200'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
              {s === 1 ? 'Upload' : s === 2 ? 'Map Data' : s === 3 ? 'Review' : 'Complete'}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="med-card p-16 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              className="hidden" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FileSpreadsheet className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">Upload your asset registry</h3>
            <p className="text-slate-500 max-w-md">
              Drop your .xlsx or .csv file here. We will extract the headers and help you map them to the BioGuard schema.
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
             key="step2"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="space-y-6"
          >
            <div className="med-card p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Map Columns</h3>
                <span className="text-sm text-slate-500">{file?.name}</span>
              </div>
              
              <div className="space-y-4">
                {TARGET_FIELDS.map((field) => (
                  <div key={field.id} className="grid grid-cols-2 gap-8 items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{field.label}</span>
                      {field.required && <span className="text-[10px] text-red-600 uppercase font-bold tracking-widest bg-red-50 px-2 py-0.5 rounded">Required</span>}
                    </div>
                    <div>
                      <select 
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-slate-700 transition-all"
                        value={mapping[field.id] !== undefined ? mapping[field.id] : ""}
                        onChange={(e) => handleMappingChange(field.id, e.target.value !== "" ? Number(e.target.value) : undefined)}
                      >
                        <option value="">-- Ignore this field --</option>
                        {headers.map((h, i) => (
                          <option key={i} value={i}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
               <button onClick={generatePreview} className="btn-primary flex items-center gap-2">
                 Preview Import <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
             key="step3"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="space-y-6"
          >
            <div className="med-card p-0 overflow-hidden">
               <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Preview Data</h3>
                  <p className="text-sm text-slate-500">Showing first 10 rows of your mapped dataset</p>
                </div>
                <button onClick={() => setStep(2)} className="text-sm font-semibold text-primary hover:underline transition-colors">
                  Edit Mapping
                </button>
              </div>

              <div className="med-table-wrapper rounded-none border-0">
                <table className="med-table">
                  <thead>
                    <tr>
                      {TARGET_FIELDS.map(f => (
                        <th key={f.id}>{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((row, i) => (
                      <tr key={i}>
                        {TARGET_FIELDS.map(f => (
                          <td key={f.id}>{row[f.id] || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="med-card p-6 bg-green-50 border-green-200 flex items-start gap-4">
               <AlertCircle className="w-6 h-6 text-green-600 shrink-0" />
               <div>
                 <h4 className="font-bold text-green-800 mb-1">Ready for Ingestion</h4>
                 <p className="text-sm text-green-700 leading-relaxed">
                   Your mapping is valid. Clicking commit will ingest {previewData.length} devices into your active registry and generate their PM schedules automatically.
                 </p>
               </div>
            </div>

            <div className="flex justify-end">
               <button onClick={executeImport} disabled={isProcessing} className="btn-primary bg-green-600 text-white border-transparent hover:bg-green-700 flex items-center gap-2">
                 {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                 {isProcessing ? "Ingesting..." : "Commit Import"}
               </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="med-card p-12 text-center max-w-2xl mx-auto mt-10"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                <CheckCircle2 className="text-success w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Ingestion Complete</h2>
            <p className="text-slate-500 mb-10 leading-relaxed text-lg">
              Successfully mapped and imported {previewData.length} devices into the registry. PM schedules have been activated and devices are now available for dispatch.
            </p>
            <Link href="/tenant">
                <button className="btn-primary mx-auto">RETURN TO DASHBOARD</button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
