"use client";

import api from "@/lib/axios";
import { useAuthStore, type User } from "@/store/useAuthStore";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRBatch {
  data: {
    qr_batch: Array<string>;
  };
}

export default function Page() {
  const user: User | null = useAuthStore((state) => state.user);
  const qrBuffer = useRef<string[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [activeQr, setActiveQr] = useState<string | undefined>("");
  const [currentBufferCount, setCurrentBufferCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const fetchQrBatch = async () => {
    if (!user || isFetching) {
      return;
    }

    setIsFetching(true);

    try {
      const res: QRBatch = await api.post("/attendance/generate-qr");
      qrBuffer.current = res.data.qr_batch;
      setActiveQr(qrBuffer.current.shift());
      setCurrentBufferCount(qrBuffer.current.length);
      setTimeLeft(10);
    } finally {
      setIsFetching(false);
    }
  };

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isClient || !user) {
      return;
    }

    fetchQrBatch();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, user]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (currentBufferCount > 0) {
        setActiveQr(qrBuffer.current.shift());
        setCurrentBufferCount(qrBuffer.current.length);
        setTimeLeft(10);
      } else if (currentBufferCount === 0) {
        setActiveQr("");
      }
    }
  }, [timeLeft, currentBufferCount]);

  if (!isClient) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-6 py-24 selection:bg-white selection:text-black overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 blur-[120px] pointer-events-none">
        <div className="h-[600px] w-[600px] rounded-full bg-white"></div>
      </div>

      <div className="z-10 w-full max-w-xl flex flex-col items-center">
        <header className="text-center mb-16">
          <span className="font-days text-sm uppercase text-white/40 tracking-[0.3em] mb-4 block">
            Attendance Protocol
          </span>
          <h1 className="font-days text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-6">
            Generate <br /> Identity.
          </h1>
          <p className="font-abel text-lg opacity-60 uppercase tracking-widest max-w-xs mx-auto">
            Scan this code to mark your presence.
          </p>
        </header>

        <div className="relative group">
          {/* Scanner UI frame */}
          <div className="absolute -inset-4 border border-white/10 rounded-[2rem] pointer-events-none transition-all duration-700 group-hover:border-white/30"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-4">
             <div className="h-1 w-12 bg-white/20 rounded-full"></div>
          </div>

          <div className="relative bg-white p-8 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-[1.02]">
            {activeQr ? (
              <div className={`transition-opacity duration-300 ${isFetching ? "opacity-40" : "opacity-100"}`}>
                <QRCodeSVG
                  value={activeQr}
                  size={260}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                  marginSize={0}
                />
              </div>
            ) : (
              <div className="w-[260px] h-[260px] flex flex-col items-center justify-center text-black/40 font-abel uppercase tracking-widest text-center">
                <p className="mb-4">Session Expired</p>
                <button 
                  onClick={() => fetchQrBatch()}
                  className="bg-black text-white px-6 py-3 rounded-full text-xs hover:scale-105 transition-transform"
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>

          {/* Countdown / Status */}
          <div className="mt-12 flex flex-col items-center gap-4">
             <div className="flex items-center gap-4">
                <div className="font-days text-4xl tabular-nums">
                  {timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="font-abel text-xs uppercase tracking-[0.2em] opacity-40">
                  Seconds <br /> Remaining
                </div>
             </div>
             
             {/* Simple progress bar */}
             <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                ></div>
             </div>
          </div>
        </div>

        <footer className="mt-24 flex flex-col items-center gap-6 opacity-30 group">
           <div className="flex gap-4 items-center font-abel text-[10px] uppercase tracking-widest">
              <span>Secure Batch</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span>{currentBufferCount} codes left</span>
           </div>
           {isFetching && (
              <span className="font-abel text-[10px] uppercase animate-pulse">
                Updating secure buffer...
              </span>
           )}
        </footer>
      </div>
    </main>
  );
}
