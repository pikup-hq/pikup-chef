import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { AppSafeAreaView } from "../components/common/AppViews";
import {
  LargeText,
  MediumText,
  SmallText,
  SemiBoldBlueText,
} from "../components/common/AppText";
import Spacing from "../constants/Spacing";
import { Eye, EyeOff } from "react-native-feather";
import { router } from "expo-router";
import { UseAuth } from "@/hooks/apis";
import { isEmailValid } from "@/utilities/helper";
import { ErrorToast } from "@/components/common/Toasts";
import Spinner from "react-native-loading-spinner-overlay";

type SignupScreenProps = {
  navigation: any;
};

const SignupScreen: React.FC<SignupScreenProps> = () => {
  const [businessName, setBusinessName] = useState<string>("");
  const [lastName, setLastName] = useState<string>(" ");

  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Password validation
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const { isLoading, isSuccess, error, data, signup } = UseAuth();

  const handleSignUp = async () => {
    if (
      email === "" ||
      phoneNumber === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      ErrorToast("Please fill in all required fields.");
    } else if (!isEmailValid(email)) {
      ErrorToast("Please enter a valid email address.");
    } else if (password !== confirmPassword) {
      ErrorToast("Password and Confirm Password must match.");
    } else if (password.length < 8) {
      ErrorToast("Password must be 8+ Characters.");
    } else if (!hasUppercase) {
      ErrorToast("Password must contain a Upper Case.");
    } else if (!hasLowercase) {
      ErrorToast("Password must contain a Lower Case.");
    } else if (!hasNumber) {
      ErrorToast("Password must contain a number.");
    } else {
      console.log("Email:", email);
      console.log("Name:", businessName, lastName);
      console.log("Phone:", phoneNumber);
      console.log("Password:", password);

      signup(email, password, businessName, lastName, phoneNumber);
    }
  };

  if (isSuccess) {
    router.push({
      pathname: "/VerifyMail",
      params: { mail: `${email}` },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Spinner color="#181C2E" visible={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.formContainer}>
            <LargeText style={styles.title}>Create your account</LargeText>
            <MediumText style={styles.subtitle}>
              Join Pikup's Vendor and revolutionize your food delivery
              experience
            </MediumText>

            {/* Business Name Input */}
            <View style={styles.inputGroup}>
              <SmallText style={styles.label}>Business name</SmallText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g Pikup Kitchens"
                  placeholderTextColor="#AAAAAA"
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              </View>
              <View style={styles.inputUnderline} />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <SmallText style={styles.label}>Email Address</SmallText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  placeholderTextColor="#AAAAAA"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputUnderline} />
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputGroup}>
              <SmallText style={styles.label}>Phone Number</SmallText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="+234 __________"
                  placeholderTextColor="#AAAAAA"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputUnderline} />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <SmallText style={styles.label}>Password</SmallText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="************"
                  placeholderTextColor="#AAAAAA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff width={20} height={20} color="#AAAAAA" />
                  ) : (
                    <Eye width={20} height={20} color="#AAAAAA" />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.inputUnderline} />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <SmallText style={styles.label}>Confirm Password</SmallText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="************"
                  placeholderTextColor="#AAAAAA"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={toggleConfirmPasswordVisibility}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff width={20} height={20} color="#AAAAAA" />
                  ) : (
                    <Eye width={20} height={20} color="#AAAAAA" />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.inputUnderline} />
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignUp}
            >
              <SemiBoldBlueText style={styles.buttonText}>
                Create your account
              </SemiBoldBlueText>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <MediumText style={styles.loginText}>
                Already have an account?{" "}
              </MediumText>
              <TouchableOpacity onPress={() => router.push("/Login")}>
                <MediumText style={styles.loginLink}>Sign In</MediumText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing * 2,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing * 4,
    justifyContent: "center",
  },
  formContainer: {
    padding: Spacing,
  },
  title: {
    fontSize: 24,
    color: "#000000",
  },
  subtitle: {
    color: "#555555",
    marginBottom: Spacing * 3,
  },
  inputGroup: {
    marginBottom: Spacing * 2,
  },
  label: {
    color: "#000000",
    marginBottom: Spacing / 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontFamily: "Sen-Regular",
    fontSize: 14,
    color: "#000000",
    paddingVertical: Spacing,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: "#FE7622",
    marginTop: 4,
  },
  eyeIcon: {
    padding: Spacing / 2,
  },
  passwordRequirements: {
    marginTop: Spacing,
    marginBottom: Spacing * 3,
  },
  requirementLabel: {
    color: "#555555",
    marginBottom: Spacing / 2,
  },
  requirementsRow: {
    flexDirection: "row",
    marginBottom: Spacing / 2,
  },
  requirement: {
    marginRight: Spacing * 2,
  },
  requirementText: {
    color: "#555555",
    fontSize: 11,
  },
  requirementMet: {
    color: "#FE7622",
  },
  signupButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingVertical: Spacing * 1.5,
    alignItems: "center",
    marginTop: Spacing * 5,
    marginBottom: Spacing,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#555555",
    fontSize: 13,
  },
  loginLink: {
    fontSize: 13,
    color: "#FE7622",
  },
});

export default SignupScreen;
