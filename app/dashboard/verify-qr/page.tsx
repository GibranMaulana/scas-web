"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function LecturerScannerPage() {
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState<
    "idle" | "scanning" | "verifying" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const [studentData, setStudentData] = useState<{
    name: string;
    time: string;
  } | null>(null);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (status !== "scanning") return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [0], // QR only
      },
      false,
    );

    const onScanSuccess = async (decodedText: string) => {
      try {
        await scanner.clear();
      } catch (e) {
        console.error("Failed to clear scanner", e);
      }

      setStatus("verifying");
      setMessage("Decrypting and verifying identity...");

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
        setMessage(
          error.response?.data?.message ||
            "Verification failed. Integrity check failed.",
        );
      }
    };

    const onScanFailure = (error: unknown) => {
      // TODO: handle nanti
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
    };
  }, [status]);

  const handleStartScanner = () => {
    setStatus("scanning");
  };

  const handleScanNext = () => {
    setStatus("idle");
    setMessage("");
    setStudentData(null);
  };

  if (!isClient) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-6 py-24 selection:bg-white selection:text-black overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 blur-[120px] pointer-events-none">
        <div className="h-[600px] w-[600px] rounded-full bg-white"></div>
      </div>

      <div className="z-10 w-full max-w-xl flex flex-col items-center">
        <header className="text-center mb-16">
          <span className="font-days text-sm uppercase text-white/40 tracking-[0.3em] mb-4 block">
            Security Protocol
          </span>
          <h1 className="font-days text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-6">
            Verify <br /> Identity.
          </h1>
          <p className="font-abel text-lg opacity-60 uppercase tracking-widest max-w-xs mx-auto">
            Authorized scanner for attendance verification.
          </p>
        </header>

        <div className="relative group w-full flex flex-col items-center">
          <div className="absolute -inset-4 border border-white/10 rounded-[2rem] pointer-events-none transition-all duration-700 group-hover:border-white/20"></div>

          <div className="relative w-full bg-black/40 backdrop-blur-sm border border-white/5 p-4 rounded-2xl shadow-2xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
            {status === "idle" && (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
                <button
                  onClick={handleStartScanner}
                  className="font-days text-xs uppercase tracking-[0.2em] bg-white text-black px-8 py-4 rounded-full hover:scale-105 transition-transform"
                >
                  Initiate Scanner
                </button>
              </div>
            )}

            {status === "scanning" && (
              <div className="w-full">
                <div
                  id="reader"
                  className="w-full rounded-xl overflow-hidden [&>div]:!border-none [&_video]:rounded-xl"
                ></div>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 w-full text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                >
                  Cancel Scan
                </button>
              </div>
            )}

            {status === "verifying" && (
              <div className="py-12 flex flex-col items-center gap-6">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-2 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-t-white rounded-full animate-spin"></div>
                </div>
                <p className="font-abel text-sm uppercase tracking-widest opacity-60 animate-pulse">
                  {message}
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="py-8 flex flex-col items-center text-center w-full px-4">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl mb-6 shadow-2xl">
                  ✓
                </div>
                <h2 className="font-days text-2xl uppercase tracking-tighter mb-4">
                  Verified.
                </h2>

                {studentData && (
                  <div className="w-full p-6 rounded-xl border border-white/10 bg-white/5 mb-8">
                    <span className="font-days text-[10px] uppercase text-white/30 tracking-widest block mb-2">
                      Subject Identified
                    </span>
                    <p className="font-days text-xl uppercase tracking-tight text-white mb-2">
                      {studentData.name}
                    </p>
                    <p className="font-abel text-[10px] uppercase tracking-widest opacity-40">
                      Timestamp: {studentData.time}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleScanNext}
                  className="w-full bg-white text-black font-days text-xs uppercase tracking-widest py-4 rounded-full hover:scale-[1.02] transition-transform"
                >
                  Continue Protocol
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="py-8 flex flex-col items-center text-center w-full px-4">
                <div className="w-16 h-16 border border-red-500/50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-6">
                  ✕
                </div>
                <h2 className="font-days text-2xl uppercase tracking-tighter mb-2">
                  Access Denied.
                </h2>
                <p className="font-abel text-xs uppercase tracking-widest text-red-400 opacity-80 mb-8 max-w-xs">
                  {message}
                </p>
                <button
                  onClick={handleScanNext}
                  className="w-full border border-white/10 hover:bg-white/5 text-white font-days text-xs uppercase tracking-widest py-4 rounded-full transition-all"
                >
                  Retry Scan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
