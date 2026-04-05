"use client";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function Page() {
  const { handleLogin, isLoading } = useGoogleAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <button
        onClick={() => handleLogin()}
        className="p-3 bg-amber-100 text-black"
        disabled={isLoading}
      >
        {isLoading ? "Memproses..." : "Login dengan Google SSO"}
      </button>
    </div>
  );
}
