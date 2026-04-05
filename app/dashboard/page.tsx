"use client";

import { useAuthStore, type User } from "@/store/useAuthStore";

export default function Page() {
  const user: User | null = useAuthStore((state) => state.user);
  return (
    <>
      <div>logged in as {user?.name}</div>
      <div>email: {user?.email}</div>
      <div>role: {user?.role}</div>
    </>
  );
}
