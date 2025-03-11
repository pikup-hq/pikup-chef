import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { MediumText } from "./AppText";

const styles = {
  OTPInputSection: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  HiddenTextInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  pressable: {
    width: 332,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  view: {
    borderColor: "#A6A6A6",
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    opacity: 0.5,
    width: 50,
    height: 50,
    alignItems: "center",
    marginTop: -30,
  },
  text: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
};

const OTPInputField = ({ setPinReady, code, setCode, maxLength }) => {
  const codeDigitsArray = new Array(maxLength).fill(0);
  const textInputRef = useRef(null);

  // Monitoring input focus
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);

  const handleOnPress = () => {
    setInputContainerIsFocused(true);
    textInputRef?.current?.focus();
  };

  const handleOnBlur = () => {
    setInputContainerIsFocused(false);
  };

  useEffect(() => {
    setPinReady(code.length === maxLength);
    return () => setPinReady(false);
  }, [code]);

  const toCodeDigitsInput = (_value, index) => {
    const emptyInputChar = " ";
    const digit = code[index] || emptyInputChar;

    const isCurrentDigit = index === code.length;
    const isLastDigit = index === code.length - 1;
    const isCodeFull = code.length === maxLength;

    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    const isFocused = inputContainerIsFocused || isDigitFocused;

    return (
      <View style={[styles.view, isFocused && { opacity: 1 }]} key={index}>
        <MediumText style={styles.text}>{digit}</MediumText>
      </View>
    );
  };

  return (
    <View style={styles.OTPInputSection}>
      <Pressable style={styles.pressable} onPress={handleOnPress}>
        {codeDigitsArray.map(toCodeDigitsInput)}
      </Pressable>
      <TextInput
        style={styles.HiddenTextInput}
        value={code}
        onChangeText={setCode}
        maxLength={maxLength}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        ref={textInputRef}
        onBlur={handleOnBlur}
      />
    </View>
  );
};

export default OTPInputField;
