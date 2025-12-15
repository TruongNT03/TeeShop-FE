import { getProfileQuery, logoutMutation } from "@/queries/authQueries";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setAccessToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const saveToken = (token: string, refreshToken?: string) => {
    localStorage.setItem("accessToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    setAccessToken(token);
  };

  const clearToken = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
  };

  const { mutate: logoutMutate } = logoutMutation();
  const { data: profile } = getProfileQuery();
  return { accessToken, saveToken, clearToken, logoutMutate, profile };
};
