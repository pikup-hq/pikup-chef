import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { CLOUDINARY_CLOUD, CLOUDINARY_PRESET } from "@/config";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const uploadImageToCloudinary = async (uri: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", { uri, type: "image/jpeg", name: "upload.jpg" } as any);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data.secure_url;
};

/**
 * Let the user pick a square image and upload it.
 * Returns the hosted URL, or null if the user cancelled.
 */
export const pickAndUploadImage = async (
  options: ImagePicker.ImagePickerOptions = {}
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
  return uploadImageToCloudinary(asset.uri);
};
