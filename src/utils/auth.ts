/**
 * Check if user is authenticated by checking access token in localStorage
 */
export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken;
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};
