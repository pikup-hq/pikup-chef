import {Dimensions} from "react-native";

const DefaultHeight = 932;
const DefaultWidth = 430;

export const ScreenHeight = Dimensions.get("window").height;
export const ScreenWidth = Dimensions.get("window").width;

export const GetWidth = (width) => {
  return (ScreenWidth * width) / DefaultWidth;
};

export const GetHeight = (height) => {
  return (ScreenHeight * height) / DefaultHeight;
};
