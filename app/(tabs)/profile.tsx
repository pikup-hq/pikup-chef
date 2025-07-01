import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { AppView } from "@/components/common/AppViews";
import { MediumText, SemiBoldText } from "@/components/common/AppText";
import { DefaultButton } from "@/components/common/Button";
import COLORS from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  CallIncoming,
  Edit,
  Headphone,
  Lock,
  Lock1,
  Logout,
  LogoutCurve,
  MessageQuestion,
  Profile,
  SecurityUser,
} from "iconsax-react-native";
import { responsiveText } from "@/utilities/helper";
import { userData } from "@/hooks/data/user";
import { router } from "expo-router";
import useAuthStore from "@/store/authStore";
import { createAvatar } from "@dicebear/core";
import { dylan } from "@dicebear/collection";
import { SvgXml } from "react-native-svg";
import Spacing from "@/constants/Spacing";

export default function ProfileScreen() {
  const handleLogout = () => {
    router.push("/OnboardingOne");
    setOpenModal(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const user = useAuthStore((state) => state.userInfo);

  let userInfo = JSON.parse(user);

  const avatar = createAvatar(dylan, {
    seed: userInfo.firstName,
    // ... other options
  }).toString();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <Modal
        visible={openModal}
        statusBarTranslucent={true}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "90%",
              paddingHorizontal: 24,
              paddingVertical: 28,
              backgroundColor: "white",
              borderRadius: 20,
            }}
          >
            <SemiBoldText
              style={{ fontSize: responsiveText(15), textAlign: "center" }}
            >
              Confirm Action
            </SemiBoldText>
            <MediumText
              style={{
                fontSize: responsiveText(12),
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              Are you sure you want to log out?
            </MediumText>
            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => setOpenModal(false)}
                style={{
                  backgroundColor: "#ececec",
                  padding: 8,
                  justifyContent: "center",
                  height: 46,
                  width: 140,
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <MediumText
                  style={{
                    color: "#494949",
                    textAlign: "left",
                    fontSize: 12,
                  }}
                >
                  No
                </MediumText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  backgroundColor: "#fe7622",
                  padding: 8,
                  justifyContent: "center",
                  height: 46,
                  width: 140,
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <MediumText
                  style={{
                    color: "#ececec",
                    textAlign: "left",
                    fontSize: 12,
                  }}
                >
                  Yes
                </MediumText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <SemiBoldText style={{ fontSize: 20 }}>Profile</SemiBoldText>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={COLORS.black}
        />
      </View>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 60,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: userInfo.avatar }}
            style={{ width: 110, height: 110, borderRadius: 20 }}
            resizeMode="cover"
          />
        </View>
        <SemiBoldText style={{ fontSize: responsiveText(17), marginTop: 5 }}>
          {userInfo.firstName
              ? userInfo.firstName + " " + userInfo.lastName
              : userInfo.name}
        </SemiBoldText>
      </View>

      {/* Profile List */}
      <TouchableOpacity
        onPress={() => {
          router.push("/MoreDetails");
        }}
        style={{
          borderRadius: 8,
          padding: 10,
          borderWidth: 1,
          borderColor: "#BDBDBD",
          flexDirection: "row",
          marginTop: responsiveText(50),
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.lightOrange,
            borderRadius: 7,
            width: 27,
            height: 27,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Profile size="19" color={COLORS.secondary} variant="Bold" />
        </View>
        <MediumText style={{ fontSize: responsiveText(13) }}>
          Edit Restaurant Details
        </MediumText>
      </TouchableOpacity>
      {/* Profile List */}
      <TouchableOpacity
        onPress={() => {
          router.push("/ChangePassword");
        }}
        style={{
          borderRadius: 8,
          padding: 10,
          borderWidth: 1,
          borderColor: "#BDBDBD",
          flexDirection: "row",
          marginTop: 15,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.lightOrange,
            borderRadius: 7,
            width: 27,
            height: 27,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Lock size="19" color={COLORS.secondary} variant="Bold" />
        </View>
        <MediumText style={{ fontSize: responsiveText(13) }}>
          Change Password
        </MediumText>
      </TouchableOpacity>
      {/* Profile List */}
      <TouchableOpacity
        onPress={() => {
          router.push("/ReachUs");
        }}
        style={{
          borderRadius: 8,
          padding: 10,
          borderWidth: 1,
          borderColor: "#BDBDBD",
          flexDirection: "row",
          marginTop: 15,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.lightOrange,
            borderRadius: 7,
            width: 27,
            height: 27,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Headphone size="19" color={COLORS.secondary} variant="Bold" />
        </View>
        <MediumText style={{ fontSize: responsiveText(13) }}>
          Reach out to us
        </MediumText>
      </TouchableOpacity>
      {/* Profile List */}
      <TouchableOpacity
        onPress={() => {
          router.push("/PrivacyPolicy");
        }}
        style={{
          borderRadius: 8,
          padding: 10,
          borderWidth: 1,
          borderColor: "#BDBDBD",
          flexDirection: "row",
          marginTop: 15,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.lightOrange,
            borderRadius: 7,
            width: 27,
            height: 27,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <SecurityUser size="19" color={COLORS.secondary} variant="Bold" />
        </View>
        <MediumText style={{ fontSize: responsiveText(13) }}>
          Privacy Policy
        </MediumText>
      </TouchableOpacity>
      {/* Profile List */}
      <TouchableOpacity
        onPress={() => {
          router.push("/Faq");
        }}
        style={{
          borderRadius: 8,
          padding: 10,
          borderWidth: 1,
          borderColor: "#BDBDBD",
          flexDirection: "row",
          marginTop: 15,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.lightOrange,
            borderRadius: 7,
            width: 27,
            height: 27,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <MessageQuestion size="19" color={COLORS.secondary} variant="Bold" />
        </View>
        <MediumText style={{ fontSize: responsiveText(13) }}>FAQ</MediumText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setOpenModal(true)}
        style={{
          marginTop: 30,
          flexDirection: "row",
          marginBottom: 30,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.lightOrange,
            borderRadius: 7,
            width: 27,
            height: 27,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Logout
            size="20"
            color="#EA3131"
            variant="Bold"
            style={{
              marginLeft: 10,
              marginRight: 10,
            }}
          />
        </View>

        <MediumText
          style={{
            fontSize: responsiveText(14),
            color: "#EA3131",
          }}
        >
          Log out
        </MediumText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
