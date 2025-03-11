import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { MediumText, BoldText, SemiBoldText } from "./AppText";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { CloseCircle, Eye, EyeSlash, SearchNormal } from "iconsax-react-native";

export const DefaultInput = (props) => {
  return (
    <View style={{ ...props.style }}>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 5,
        }}
      >
        {props.title}
      </SemiBoldText>
      <TextInput
        style={{
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          borderBottomWidth: 2,
          borderBottomColor: "#FE7622",
          paddingLeft: 22,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 14,
          fontFamily: "Sen-Regular",
        }}
        placeholder={props.placeholder}
        placeholderTextColor="#494949"
        onChangeText={(val) => props.onChangeText(val)}
      />
    </View>
  );
};

export const EditInput = (props) => {
  return (
    <View style={{ ...props.style }}>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        {props.title}
      </SemiBoldText>
      <TextInput
        style={{
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          paddingLeft: 22,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 14,
          fontFamily: "Sen-Regular",
        }}
        placeholder={props.placeholder}
        placeholderTextColor="#494949"
        onChangeText={(val) => props.onChangeText(val)}
      />
    </View>
  );
};

export const DefaultArea = (props) => {
  return (
    <View style={{ ...props.style }}>
      <TextInput
        numberOfLines={10}
        style={{
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          borderBottomWidth: 2,
          borderBottomColor: "#FE7622",
          paddingLeft: 22,
          paddingRight: 10,
          paddingBottom: 10,
          fontSize: 14,
          fontFamily: "Sen-Regular",
        }}
        placeholder={props.placeholder}
        placeholderTextColor="#494949"
        onChangeText={(val) => props.onChangeText(val)}
      />
    </View>
  );
};

export const NumInput = (props) => {
  return (
    <View style={{ ...props.style }}>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 5,
        }}
      >
        {props.title}
      </SemiBoldText>
      <TextInput
        style={{
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          borderBottomWidth: 2,
          borderBottomColor: "#FE7622",
          paddingLeft: 22,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 14,
          fontFamily: "Sen-Regular",
        }}
        placeholder={props.placeholder}
        value={props.val}
        placeholderTextColor="#494949"
        onChangeText={(val) => props.onChangeText(val)}
        keyboardType="phone-pad"
      />
    </View>
  );
};

export const EditNum = (props) => {
  return (
    <View style={{ ...props.style }}>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        {props.title}
      </SemiBoldText>
      <TextInput
        style={{
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          paddingLeft: 22,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 14,
          fontFamily: "Sen-Regular",
        }}
        placeholder={props.placeholder}
        value={props.val}
        placeholderTextColor="#494949"
        onChangeText={(val) => props.onChangeText(val)}
        keyboardType="phone-pad"
      />
    </View>
  );
};

export const EmailInput = (props) => {
  return (
    <View style={{ ...props.style }}>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 5,
        }}
      >
        {props.title}
      </SemiBoldText>
      <TextInput
        style={{
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          borderBottomWidth: 2,

          borderBottomColor: "#FE7622",
          paddingLeft: 22,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 14,
          fontFamily: "Sen-Regular",
        }}
        placeholder={props.placeholder}
        placeholderTextColor="#494949"
        onChangeText={(val) => props.onChangeText(val)}
        keyboardType="email-address"
      />
    </View>
  );
};

export const EditEmail = (props) => {
  return (
    <View style={{ ...props.style }}>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        {props.title}
      </SemiBoldText>
      <TextInput
        style={{
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          paddingLeft: 22,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 14,
          fontFamily: "Sen-Regular",
        }}
        placeholder={props.placeholder}
        placeholderTextColor="#494949"
        onChangeText={(val) => props.onChangeText(val)}
        keyboardType="email-address"
      />
    </View>
  );
};

export const PasswordInput = (props) => {
  const [password, setPassword] = useState(null);
  const [isPasswordShown, setIsPasswordShown] = useState(true);

  return (
    <View>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 5,
        }}
      >
        {props.title}
      </SemiBoldText>
      <View
        style={{
          width: "100%",
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          borderBottomColor: "#FE7622",
          borderRadius: 5,
          borderBottomWidth: 2,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 22,
          ...props.style,
        }}
      >
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#494949"
          secureTextEntry={isPasswordShown}
          value={password}
          onChangeText={(val) => props.onChangeText(val)}
          style={{
            width: "100%",
            fontSize: 13,
            fontFamily: "Sen-Regular",
            paddingVertical: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => setIsPasswordShown(!isPasswordShown)}
          style={{
            position: "absolute",
            right: 12,
          }}
        >
          {isPasswordShown == true ? (
            <Eye size="20" color="black" />
          ) : (
            <EyeSlash size="20" color="black" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const EditPassword = (props) => {
  const [password, setPassword] = useState(null);
  const [isPasswordShown, setIsPasswordShown] = useState(true);

  return (
    <View>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 5,
        }}
      >
        {props.title}
      </SemiBoldText>
      <View
        style={{
          width: "100%",
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 22,
          ...props.style,
        }}
      >
        <TextInput
          placeholder=""
          placeholderTextColor="#494949"
          secureTextEntry={isPasswordShown}
          value={password}
          onChangeText={(val) => props.onChangeText(val)}
          style={{
            width: "100%",
            fontSize: 13,
            fontFamily: "Sen-Regular",
            paddingVertical: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => setIsPasswordShown(!isPasswordShown)}
          style={{
            position: "absolute",
            right: 12,
          }}
        >
          {isPasswordShown == true ? (
            <Eye size="20" color="black" />
          ) : (
            <EyeSlash size="20" color="black" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SearchInput = (props) => {
  const [password, setPassword] = useState(null);

  return (
    <View>
      <SemiBoldText
        style={{
          fontSize: 13,
          marginBottom: 5,
        }}
      >
        {props.title}
      </SemiBoldText>
      <View
        style={{
          width: "100%",
          backgroundColor: "#ECECEC",
          borderRadius: 10,
          borderBottomColor: "#FE7622",
          borderRadius: 5,
          borderBottomWidth: 2,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 22,
          ...props.style,
        }}
      >
        <TextInput
          placeholder="Restaurant, Food, Drinks"
          placeholderTextColor="#494949"
          value={password}
          onChangeText={(val) => props.onChangeText(val)}
          style={{
            width: "100%",
            fontSize: 13,
            fontFamily: "Sen-Regular",
            paddingVertical: 10,
            marginLeft: 50,
          }}
        />

        <TouchableOpacity
          style={{
            position: "absolute",
            left: 12,
          }}
        >
          <SearchNormal size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 12,
          }}
        >
          <CloseCircle size="20" color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
