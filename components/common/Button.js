import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { MediumText, SemiBoldText } from "./AppText";

export const DefaultButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        ...{
          backgroundColor: "black",
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 56,
        },
        ...props.style,
      }}
      onPress={props.onPress}
    >
      <SemiBoldText
        style={{
          fontSize: 14,
          color: "#FFFFFF",
        }}
      >
        {props.title}
      </SemiBoldText>
    </TouchableOpacity>
  );
};

export const BorderButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        ...{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 60,
        },
        ...props.style,
      }}
      onPress={props.onPress}
    >
      <MediumText
        style={{
          fontSize: 14,
          color: "#646982",
          textTransform: "capitalize",
        }}
      >
        {props.title}
      </MediumText>
    </TouchableOpacity>
  );
};

export const MenuButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        ...{
          backgroundColor: "black",
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          height: 45,
          width: 200,
        },
        ...props.style,
      }}
      onPress={props.onPress}
    >
      <SemiBoldText
        style={{
          fontSize: 14,
          color: "#FFFFFF",
        }}
      >
        {props.title}
      </SemiBoldText>
    </TouchableOpacity>
  );
};
