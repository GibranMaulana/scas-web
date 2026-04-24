"use client";

import { SyntheticEvent } from "react";

interface OtpFormProps {
  email: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  onSubmit: (e: SyntheticEvent) => void;
  onBack: () => void;
  isLoading: boolean;
  otpError: string;
}

export default function OtpForm({
  email,
  otpCode,
  setOtpCode,
  onSubmit,
  onBack,
  isLoading,
  otpError,
}: OtpFormProps) {
  return (
    <div className="z-10 w-full max-w-md flex flex-col items-center">
      <header className="text-center mb-12">
        <span className="font-days text-sm uppercase text-white/40 tracking-[0.3em] mb-4 block">
          Security Verification
        </span>
        <h1 className="font-days text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-6">
          Device <br /> Trusted?
        </h1>
        <p className="font-abel text-sm opacity-60 uppercase tracking-widest max-w-xs mx-auto">
          A secure code has been dispatched to <br />
          <span className="text-white/80">{email}</span>
        </p>
      </header>

      <form onSubmit={onSubmit} className="w-full flex flex-col items-center gap-8 group">
        <div className="relative w-full">
          {/* Input Frame */}
          <div className="absolute -inset-4 border border-white/5 rounded-2xl pointer-events-none group-focus-within:border-white/20 transition-all duration-500"></div>
          
          <input
            type="text"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="000000"
            className="w-full bg-white/5 border border-white/10 p-6 rounded-xl text-center text-4xl tracking-[0.5em] font-days focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10 text-white"
            required
            autoFocus
          />
        </div>

        {otpError && (
          <p className="font-abel text-xs uppercase tracking-widest text-red-400 bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
            {otpError}
          </p>
        )}

        <div className="w-full flex flex-col gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-days text-xs uppercase tracking-[0.2em] py-5 rounded-full hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? "Validating..." : "Verify Identity"}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="font-abel text-[10px] uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity"
          >
            Return to Authentication
          </button>
        </div>
      </form>

      <footer className="mt-20 opacity-20 text-center">
        <div className="font-days text-[8px] uppercase tracking-[0.4em]">
          End-to-End Encrypted Session
        </div>
      </footer>
    </div>
  );
}
