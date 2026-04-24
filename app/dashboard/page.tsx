"use client";

import Footer from "@/components/landing/Footer";
import { useAuthStore, type User } from "@/store/useAuthStore";
import { useSyncExternalStore } from "react";

export default function Page() {
  const user: User | null = useAuthStore((state) => state.user);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-6 py-24 selection:bg-white selection:text-black overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 blur-[120px] pointer-events-none">
        <div className="h-[500px] w-[500px] rounded-full bg-white/40"></div>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        <header className="text-center mb-20">
          <span className="font-days text-sm uppercase text-white/40 tracking-[0.3em] mb-4 block">
            Secure Portal
          </span>
          <h1 className="font-days text-5xl md:text-9xl uppercase tracking-tighter leading-none px-4">
            Dashboard.
          </h1>
        </header>

        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16">
          <div className="flex flex-col gap-2">
            <span className="font-days text-xs uppercase text-white/30 tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-white/30 rounded-full"></span>
              01. Full Name
            </span>
            <p className="font-days text-2xl uppercase tracking-tight">
              {user?.name || "Anonymous"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-days text-xs uppercase text-white/30 tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-white/30 rounded-full"></span>
              02. Email
            </span>
            <p className="font-days text-2xl lowercase tracking-tight break-all">
              {user?.email || "N/A"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-days text-xs uppercase text-white/30 tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-white/30 rounded-full"></span>
              03. Role
            </span>
            <div className="flex items-center gap-3">
              <p className="font-days text-2xl uppercase tracking-tight text-white">
                {user?.role || "Restricted"}
              </p>
              <div className="px-2 py-0.5 border border-white/20 rounded-full text-[8px] font-days uppercase tracking-widest">
                Active
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-24"></div>
      </div>
    </main>
  );
}
