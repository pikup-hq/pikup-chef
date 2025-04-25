import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppSafeAreaView } from "@/components/common/AppViews";
import { ArrowLeft, Back, ColorsSquare } from "iconsax-react-native";
import {
  MediumBlueText,
  MediumText,
  SemiBoldText,
} from "@/components/common/AppText";
import COLORS from "@/constants/colors";
import OTPInputField from "@/components/common/OTPInputField";
import { DefaultButton } from "@/components/common/Button";
// import { useLocation } from "../../lib/hooks/use-location";
// import { UseAuth } from "../../lib/hooks/auth";
import Spinner from "react-native-loading-spinner-overlay";
import { router, useLocalSearchParams } from "expo-router";
import { UseAuth } from "@/hooks/apis";
import Spacing from "@/constants/Spacing";
// import useAuthStore from "../../store/authStore";

export default function VerifyMail() {
  const [code, setCode] = useState("");
  const [pinReady, setPinReady] = useState(false);
  const MAX_CODE_LENGTH = 4;

  const [timerRemaining, setTimerRemaining] = useState(30);
  const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(true);

  const { mail } = useLocalSearchParams();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimerRemaining((prevTimer) => prevTimer - 1);
      if (timerRemaining === 0) {
        clearInterval(intervalId);
        setIsResendButtonDisabled(false);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerRemaining]);

  useEffect(() => {
    if (code.length === MAX_CODE_LENGTH) {
      setPinReady(true);
    } else {
      setPinReady(false);
    }
  }, [code]);

  let otp = code;

  const { isLoading, isSuccess, verifyUser, resendOtp } = UseAuth();

  const handleOtp = () => {
    const emailAddress = Array.isArray(mail) ? mail[0] : mail;
    verifyUser(otp, emailAddress);
  };

  if (isSuccess) {
    router.push("/Login");
  }

  const handleResendOtp = () => {
    const emailAddress = Array.isArray(mail) ? mail[0] : mail;
    resendOtp(emailAddress);
    setIsResendButtonDisabled(true);
    setTimerRemaining(30);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <Spinner color="#181C2E" visible={isLoading} />
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={{ marginTop: 20 }}
      >
        <ArrowLeft size="32" color="black" />
      </TouchableOpacity>

      <SemiBoldText
        style={{
          textAlign: "center",
          fontSize: 18,
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        We've sent you a mail
      </SemiBoldText>
      <MediumText
        style={{ textAlign: "center", color: COLORS.greyText, fontSize: 13 }}
      >
        Enter the verification code we sent to {mail}
      </MediumText>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <OTPInputField
          setPinReady={setPinReady}
          code={code}
          setCode={setCode}
          maxLength={MAX_CODE_LENGTH}
        />
      </View>
      <TouchableOpacity
        onPress={() => router.push("/Login")}
        style={{
          flexDirection: "row",
          marginTop: -10,
          justifyContent: "center",
        }}
      >
        <MediumText style={{ fontSize: 13 }}>Not your mail? </MediumText>
        <MediumBlueText style={{ fontSize: 13 }}>Update email</MediumBlueText>
      </TouchableOpacity>
      <View style={{ marginTop: 100 }}>
        <DefaultButton
          onPress={handleOtp}
          style={{ marginTop: 35 }}
          title="Verify"
        />
        <TouchableOpacity
          disabled={isResendButtonDisabled}
          onPress={handleResendOtp}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          <MediumText style={{ fontSize: 14 }}>
            Didn't get the code?{" "}
          </MediumText>
          <MediumBlueText style={{ fontSize: 14 }}>
            Resend {isResendButtonDisabled ? `in ${timerRemaining}s` : ""}
          </MediumBlueText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
