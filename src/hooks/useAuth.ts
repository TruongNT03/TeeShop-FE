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

  const saveToken = (token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  };

  const clearToken = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  const { mutate: logoutMutate } = logoutMutation();
  const { data: profile } = getProfileQuery();
  return { accessToken, saveToken, clearToken, logoutMutate, profile };
};
