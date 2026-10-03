import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { CLOUDINARY_CLOUD, CLOUDINARY_PRESET } from "@/config";
import api from "@/services/api";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type UploadKind = "avatar" | "menu" | "extra";

/**
 * Upload with a short-lived signature from our API. Falls back to the legacy
 * unsigned preset only while the API has no Cloudinary keys (503).
 */
export const uploadImageToCloudinary = async (uri: string, kind: UploadKind = "menu"): Promise<string> => {
  const formData = new FormData();
  formData.append("file", { uri, type: "image/jpeg", name: "upload.jpg" } as any);
  const headers = { "Content-Type": "multipart/form-data" };

  try {
    const { data: sig } = await api.post("/uploads/signature", { kind });
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);
    const response = await axios.post(sig.uploadUrl, formData, { headers });
    return response.data.secure_url;
  } catch (error: any) {
    if (error?.response?.status !== 503) throw error;
    formData.append("upload_preset", CLOUDINARY_PRESET);
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, formData, {
      headers,
    });
    return response.data.secure_url;
  }
};

/**
 * Let the user pick a square image and upload it.
 * Returns the hosted URL, or null if the user cancelled.
 */
export const pickAndUploadImage = async (
  options: ImagePicker.ImagePickerOptions = {},
  kind: UploadKind = "menu"
): Promise<string | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    ...options,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
    throw new Error("Image must be smaller than 5MB");
  }
  return uploadImageToCloudinary(asset.uri, kind);
};
