"use client";

import { useAuthStore, type User } from "@/store/useAuthStore";
import { useSyncExternalStore } from "react";

export default function Page() {
  const user: User | null = useAuthStore((state) => state.user);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {isClient ? (
        <>
          <div>logged in as {user?.name}</div>
          <div>email: {user?.email}</div>
          <div>role: {user?.role}</div>
        </>
      ) : (
        <div>loading data</div>
      )}
    </div>
  );
}
