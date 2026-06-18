import { jwtDecode } from "jwt-decode";

export const checkIsLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Decode the JWT payload
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // If the current time is greater than the expiration time, it's expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token"); // Clean up the expired token
      return false;
    }

    return true;
  } catch (error) {
    // If decoding fails, the token is corrupt or invalid
    return false;
  }
};