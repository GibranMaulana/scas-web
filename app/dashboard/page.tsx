"use client";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function Page() {
  const { handleLogout } = useGoogleAuth();

  return (
    <>
      <div>logged in</div>
      <button onClick={() => handleLogout()}> logout </button>
    </>
  );
}
