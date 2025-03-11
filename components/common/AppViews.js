import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";

import COLORS from "../../constants/colors";
import Spacing from "../../constants/Spacing";

// Add Animated View

export const AppSafeAreaView = (props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        paddingTop: StatusBar.currentHeight + 5,
        ...props.style,
      }}
    >
      {props.children}
    </SafeAreaView>
  );
};

export const AppBgView = (props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        paddingTop: StatusBar.currentHeight + 10,
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

export const AppScrollView = (props) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={{
        flex: 1,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        backgroundColor: COLORS.white,
        paddingTop: StatusBar.currentHeight + 10,
        marginTop: 0,
        ...props.style,
      }}
      {...props}
    >
      {props.children}
    </ScrollView>
  );
};

export const AppRareScrollView = (props) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={{
        backgroundColor: COLORS.white,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        backgroundColor: COLORS.white,
        paddingTop: StatusBar.currentHeight + 10,
        marginTop: 0,
        ...props.style,
      }}
    >
      {props.children}
    </ScrollView>
  );
};

export const AppSectionView = (props) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.secondary,
        paddingVertical: 20,
        marginBottom: 10,
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

export const AppView = (props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        paddingTop: StatusBar.currentHeight + 5,
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

export const AppRareView = (props) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.lightOrange,
        flex: 1,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        paddingTop: StatusBar.currentHeight + 5,
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

export const AppSignUpView = (props) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        flex: 1,
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

export const AppLightScrollView = (props) => {
  return (
    <ScrollView
      style={{
        backgroundColor: COLORS.lightOrange,
        flex: 1,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        paddingTop: StatusBar.currentHeight + 5,
        ...props.style,
      }}
    >
      {props.children}
    </ScrollView>
  );
};

export const AppRareBgView = (props) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
        paddingTop: StatusBar.currentHeight + 5,
        ...props.style,
      }}
    >
      {props.children}
    </SafeAreaView>
  );
};

export const AppKeyboardView = (props) => {
  return (
    <Pressable
      onpress={Keyboard.dismiss}
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        paddingTop: StatusBar.currentHeight + 5,
        ...props.style,
      }}
    >
      {props.children}
    </Pressable>
  );
};

export const AppKeyboardAvoidingView = (props) => {
  return (
    <KeyboardAvoidingView
      onpress={Keyboard.dismiss}
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        paddingLeft: Spacing * 2,
        paddingRight: Spacing * 2,
        paddingTop: StatusBar.currentHeight + 5,
        ...props.style,
      }}
    >
      {props.children}
    </KeyboardAvoidingView>
  );
};
