"use client";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import LoginForm from "@/components/auth/LoginForm";
import OtpForm from "@/components/auth/OtpForm";
import { useSyncExternalStore } from "react";

export default function Page() {
  const {
    handleLogin,
    isLoading,
    setIsOtp,
    isOtp,
    email,
    otpCode,
    handleVerifyDevice,
    setOtpCode,
    otpError,
  } = useGoogleAuth();

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-6 py-24 selection:bg-white selection:text-black overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 blur-[120px] pointer-events-none">
        <div className="h-[600px] w-[600px] rounded-full bg-white"></div>
      </div>

      {isOtp ? (
        <OtpForm
          email={email}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          onSubmit={handleVerifyDevice}
          onBack={() => setIsOtp(false)}
          isLoading={isLoading}
          otpError={otpError}
        />
      ) : (
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
      )}
    </main>
  );
}
