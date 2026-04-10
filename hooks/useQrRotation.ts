import api from "@/lib/axios";
import type { User } from "@/store/useAuthStore";
import { useEffect, useRef, useState } from "react";

interface QRBatch {
  data: {
    qr_batch: Array<string>;
  };
}

export function useQrRotation(user: User, isClient: boolean) {
  const qrBuffer = useRef<string[]>([]);
  const [activeQr, setActiveQr] = useState<string | undefined>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [bufferCount, setBufferCount] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchQrBatch = async () => {
    if (!user || isFetching) {
      return;
    }

    setIsFetching(true);

    try {
      const res: QRBatch = await api.post("/attendance/generate-qr");
      qrBuffer.current = res.data.qr_batch;
      setActiveQr(qrBuffer.current.shift());
      setBufferCount(qrBuffer.current.length);
      setTimeLeft(0);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("unknown error occured", String(error));
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isClient || !user) {
      return;
    }

    fetchQrBatch();
  });
}
