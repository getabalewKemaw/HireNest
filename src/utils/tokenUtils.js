/**
 * Token utility functions for JWT handling
 * Tokens are stored in memory only for security
 */

let accessToken = null;

/**
 * Sets the access token in memory
 * @param {string} token - JWT access token
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Gets the access token from memory
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
  return accessToken;
};

/**
 * Clears the access token from memory
 */
export const clearAccessToken = () => {
  accessToken = null;
};

/**
 * Decodes JWT token payload
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Checks if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Gets user info from token
 * @param {string} token - JWT token
 * @returns {Object|null} User info or null
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded.userId,
    email: decoded.sub,
    userType: decoded.userType,
    role: decoded.userType ? `ROLE_${decoded.userType}` : null,
  };
};

/**
 * Checks if token will expire soon
 * @param {string} token - JWT token
 * @param {number} bufferMs - Buffer time in milliseconds
 * @returns {boolean} True if expiring soon
 */
export const isTokenExpiringSoon = (token, bufferMs = 60000) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  const expiryTime = decoded.exp - (bufferMs / 1000);

  return currentTime >= expiryTime;
};
