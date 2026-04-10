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
      console.log(qrBuffer);
      setIsFetching(false);
      console.log("done fetching, countdown:");
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
  }, [timeLeft]);

  return (
    <div className="flex flex-col min-h-screen items-center jusitfy-center">
      <div className="p-4 rounded-xl flex justify-center items-center mb-6 relative min-h-screen">
        {activeQr ? (
          <div
            className={`transition-opacity duration-300 ${isFetching ? "opacity-50" : "opacity-100"} bg-white`}
          >
            <QRCodeSVG
              value={activeQr}
              size={300}
              bgColor="#F3F4F6"
              fgColor="#111827"
              level="M"
              marginSize={4}
            />
            <p className="text-black">{timeLeft}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <span className="mb-2 text-3xl">⚠️</span>
            <p className="text-sm font-medium">Sesi QR Habis</p>
            <p className="text-xs">Silakan minta kode baru</p>
            <button onClick={() => fetchQrBatch()} className="p-3 bg-blue-500">
              Kode Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
