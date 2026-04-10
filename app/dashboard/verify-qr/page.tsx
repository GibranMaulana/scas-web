// File: src/app/lecturer/scanner/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "@/lib/axios";

export default function LecturerScannerPage() {
  const [status, setStatus] = useState<
    "idle" | "scanning" | "verifying" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const [studentData, setStudentData] = useState<{
    name: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    // We only want to initialize the scanner when the component is mounted (idle)
    if (status !== "idle" && status !== "scanning") return;

    // 1. Initialize the Scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10, // Frames per second to scan
        qrbox: { width: 250, height: 250 }, // The scanning UI box
        supportedScanTypes: [0, 1], // 0 = Camera, 1 = File Upload (Crucial for your laptop test!)
      },
      false, // verbose mode off
    );

    // 2. The Success Callback
    const onScanSuccess = async (decodedText: string) => {
      // Instantly stop scanning so we don't spam the Laravel API
      scanner.clear();
      setStatus("verifying");
      setMessage("Decrypting and verifying attendance...");

      try {
        const res = await api.post("/attendance/verify", {
          qr_payload: decodedText,
        });

        setStatus("success");
        setMessage(res.data.message);
        setStudentData({
          name: res.data.data.student_name,
          time: res.data.data.scanned_at,
        });
      } catch (error: any) {
        setStatus("error");
        // Display the specific error message from Laravel (Expired, Tampered, etc.)
        setMessage(
          error.response?.data?.message ||
            "Verification failed. Please try again.",
        );
      }
    };

    const onScanFailure = (error: unknown) => {
      // We ignore failures here, because it simply means "No QR found in this frame yet"
    };

    // 3. Render the Scanner UI into the 'reader' div
    scanner.render(onScanSuccess, onScanFailure);
    setStatus("scanning");

    // 4. Cleanup function: Destroy the camera stream if the user leaves the page
    return () => {
      scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Helper to reset the scanner for the next student
  const handleScanNext = () => {
    setStatus("idle");
    setMessage("");
    setStudentData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Lecturer Scanner
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
        {/* The div where html5-qrcode will inject its Camera and File Upload UI.
                  It MUST have the id "reader".
                */}
        {(status === "idle" || status === "scanning") && (
          <div
            id="reader"
            className="w-full overflow-hidden rounded-lg border-2 border-gray-200"
          ></div>
        )}

        {/* Status and Results UI */}
        {status === "verifying" && (
          <div className="py-12 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium text-center">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 flex flex-col items-center text-center w-full">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm">
              ✓
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Attendance Verified!
            </h2>

            {studentData && (
              <div className="bg-gray-50 w-full p-4 rounded-xl border border-gray-100 mt-4 mb-6">
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-semibold text-lg text-gray-800">
                  {studentData.name}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Recorded at: {studentData.time}
                </p>
              </div>
            )}

            <button
              onClick={handleScanNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
            >
              Scan Next Student
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="py-8 flex flex-col items-center text-center w-full">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm">
              ✗
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Scan Failed
            </h2>
            <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 mb-6 w-full text-sm">
              {message}
            </p>
            <button
              onClick={handleScanNext}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
