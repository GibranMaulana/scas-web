"use client";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useSyncExternalStore } from "react";

interface href {
  name: string;
  url: string;
  action?: () => void;
}

export default function Header() {
  const user = useAuthStore((state) => state.user);

  const { handleLogin, handleLogout } = useGoogleAuth();

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <header className="absolute top-0 left-0 w-full flex flex-row justify-center py-2 gap-2">
      {isClient && user ? (
        <>
          <nav>home</nav>
          <nav>dashboard</nav>
          <nav>generate-qr</nav>
          <button onClick={() => handleLogout()}>logout</button>
        </>
      ) : (
        <>
          <button onClick={() => handleLogin()}>login</button>
        </>
      )}
    </header>
  );
}
