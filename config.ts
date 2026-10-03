// Public, non-secret configuration. Set values in .env (see .env.example).
// Never put API secret keys here: EXPO_PUBLIC_* values are bundled into the app.
export const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "https://api.pikup.com.ng"
).replace(/\/+$/, "");

export const CLOUDINARY_CLOUD = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD || "duudwz4tx";
export const CLOUDINARY_PRESET =
  process.env.EXPO_PUBLIC_CLOUDINARY_PRESET || "pikup-images";
