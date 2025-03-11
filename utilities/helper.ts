import Constants from "expo-constants";
import { Platform, Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

export const responsiveText = (fontSize: number, standardHeight = 680) => {
  const screenHeight = width > height ? width : height;
  const offset =
    width > height ? 0 : Platform.OS === "ios" ? 78 : Constants.statusBarHeight;

  const deviceHeight =
    Platform.OS === "android" ? height - offset : screenHeight;

  return Math.round((fontSize * deviceHeight) / standardHeight);
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters except the leading '+'
  const cleaned = ("" + phoneNumber).replace(/(?!^\+)\D/g, "");

  // Remove any leading '0' or '+234' and ensure the phone number starts correctly
  const cleanedWithoutCountryCode = cleaned.replace(/^(\+?234|0)/, "");

  // Match the groups of numbers
  const match = cleanedWithoutCountryCode.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    // Return the formatted number with '+234' in front
    return `+234 ${match[1]} ${match[2]} ${match[3]}`;
  }

  // If input doesn't match the format, return it with '+234' unformatted
  return `+234 ${cleanedWithoutCountryCode}`;
};

export function hasUppercase(str: string) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i].toUpperCase() && str[i] !== str[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}

export function isEmailValid(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function hasLowercase(str: string) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i].toLowerCase() && str[i] !== str[i].toUpperCase()) {
      return true;
    }
  }
  return false;
}

export function hasSpecialChar(str: string) {
  for (let i = 0; i < str.length; i++) {
    if (!str[i].match(/[A-Za-z0-9]/)) {
      return true;
    }
  }
  return false;
}

export function hasNumber(inputString: string) {
  // Use isNaN to check if the parsed value is NaN (not a number)
  return /\d/.test(inputString);
}
