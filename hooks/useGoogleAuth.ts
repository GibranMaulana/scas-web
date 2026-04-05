import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import axios from "axios";

interface AuthResponse {
  status: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const loginStore = useAuthStore((state) => state.login);

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      setIsLoading(true);

      try {
        const res = await api.post<AuthResponse>("/auth/google", {
          google_token: tokenResponse.access_token,
          client_type: "web",
        });

        loginStore(res.data.token, res.data.user);

        document.cookie = `scas=${res.data.token}; path=/; max-age=86400; SameSite=Lax`;

        route.push("/dashboard");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const serverData = error.response?.data;
          const serverMessage =
            serverData?.message ||
            serverData?.error ||
            "Terjadi kesalahan pada server.";

          alert(`[Error ${status || "Network"}] ${serverMessage}`);
          console.error("Detail Error from server:", serverData);
        } else if (error instanceof Error) {
          alert("Error internal aplikasi: " + error.message);
        } else {
          alert("something happen on the server");
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => alert("Google Login failed"),
  });

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      loginStore(null, null);
      document.cookie = "scas=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      route.push("/login");
    }
  };
  return {
    handleLogin,
    handleLogout,
    isLoading,
  };
};
