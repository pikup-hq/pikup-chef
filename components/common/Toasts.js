import Toast from "react-native-toast-message";

export function SuccessToast(description) {
  return Toast.show({
    type: "success",
    text1: "Success ✅",
    text2: description,
  });
}

export function ErrorToast(description) {
  return Toast.show({
    type: "error",
    text1: "Error❗️",
    text2: description,
  });
}

export function WarningToast(description) {
  return Toast.show({
    type: "warning",
    text1: "Warning ⚠️",
    text2: description,
  });
}

export function InfoToast(description) {
  return Toast.show({
    type: "info",
    text1: "Info ℹ️",
    text2: description,
  });
}
