import React from "react";
import { Text, StyleSheet } from "react-native";
import { responsiveText } from "../../utilities/helper";

// Text component with styles applied
const XtraLargeText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.xtraLargeText, style]} {...props}>
      {children}
    </Text>
  );
};

const LargeText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.largeText, style]} {...props}>
      {children}
    </Text>
  );
};

const MediumText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.mediumText, style]} {...props}>
      {children}
    </Text>
  );
};

const MediumBlueText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.mediumBlueText, style]} {...props}>
      {children}
    </Text>
  );
};

const BoldText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.boldText, style]} {...props}>
      {children}
    </Text>
  );
};

const SemiBoldText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.semiBoldText, style]} {...props}>
      {children}
    </Text>
  );
};

const SemiBoldBlueText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.semiBoldBlueText, style]} {...props}>
      {children}
    </Text>
  );
};

const SmallText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.smallText, style]} {...props}>
      {children}
    </Text>
  );
};

const ItalicText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.italicText, style]} {...props}>
      {children}
    </Text>
  );
};

// Stylesheet for the text components
const styles = StyleSheet.create({
  xtraLargeText: {
    color: "#32343e",
    fontSize: responsiveText(30),
    fontFamily: "Sen-Bold",
  },
  largeText: {
    color: "#32343e",
    fontSize: responsiveText(20),
    fontFamily: "Sen-Bold",
  },
  mediumText: {
    color: "#32343e",
    fontSize: responsiveText(14),
    fontFamily: "Sen-Regular",
  },
  italicText: {
    color: "#32343e",
    fontSize: responsiveText(12),
    fontFamily: "Sen-Italic",
  },
  mediumBlueText: {
    color: "#FE7622",
    fontSize: responsiveText(14),
    fontFamily: "Sen-Regular",
  },
  boldText: {
    color: "#32343e",
    fontSize: responsiveText(14),
    fontFamily: "Sen-SemiBold",
  },
  semiBoldText: {
    color: "#32343e",
    fontSize: responsiveText(14),
    fontFamily: "Sen-SemiBold",
  },
  semiBoldBlueText: {
    color: "#181c2e",
    fontSize: responsiveText(14),
    fontFamily: "Sen-SemiBold",
  },
  smallText: {
    color: "#32343e",
    fontSize: responsiveText(12),
    fontFamily: "Sen-Regular",
  },
});

export {
  XtraLargeText,
  LargeText,
  MediumText,
  MediumBlueText,
  BoldText,
  SemiBoldText,
  SemiBoldBlueText,
  SmallText,
  ItalicText,
};
