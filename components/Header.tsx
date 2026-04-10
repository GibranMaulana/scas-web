"use client";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useState, useEffect, useSyncExternalStore } from "react";

interface href {
  name: string;
  url: string;
  action?: () => void;
}

export default function Header() {
  const STUDENT_LINKS: href[] = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
    {
      name: "Generate QR",
      url: "/dashboard/generate-qr",
    },
  ];

  const LECTURER_LINKS: href[] = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
    {
      name: "Verify QR",
      url: "/dashboard/verify-qr",
    },
  ];

  const { handleLogin, handleLogout } = useGoogleAuth();

  const user = useAuthStore((state) => state.user);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) {
    return (
      <div className="absolute top-0 left-0 w-full flex flex-row justify-between py-2 gap-2">
        Loading data
      </div>
    );
  }

  return (
    <header className="absolute top-0 left-0 w-full flex flex-row justify-between py-2 gap-2">
      {isClient && user ? (
        <>
          <div className="flex flex-row gap-4">
            {user.role === "student" &&
              STUDENT_LINKS.map((s, i) => (
                <nav key={i}>
                  <Link href={s.url}>{s.name}</Link>
                </nav>
              ))}
            {user.role === "student" && //TODO: di production student ganti ke 'lecturer'
              LECTURER_LINKS.map((l, i) => (
                <nav key={i}>
                  <Link href={l.url}>{l.name}</Link>
                </nav>
              ))}
          </div>
          <button
            onClick={() => handleLogout()}
            className="hover:cursor-pointer"
          >
            logout
          </button>
          <div className="flex flex-col">
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
        </>
      ) : (
        <>
          <button onClick={() => handleLogin()}>login</button>
        </>
      )}
    </header>
  );
}
