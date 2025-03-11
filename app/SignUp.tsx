import React, { useState } from "react";
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { AppSafeAreaView } from "../components/common/AppViews";
import { 
  LargeText, 
  MediumText, 
  SmallText, 
  SemiBoldBlueText 
} from "../components/common/AppText";
import COLORS from "../constants/colors";
import Spacing from "../constants/Spacing";
import { Eye, EyeOff } from "react-native-feather";
import { router } from "expo-router";

type SignupScreenProps = {
  navigation: any;
};

const SignupScreen: React.FC<SignupScreenProps> = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

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

  const handleSignup = () => {
    // Implement signup logic here
    console.log("Signing up...");
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <LargeText style={styles.title}>Create your account</LargeText>
            <MediumText style={styles.subtitle}>
              Join Pikup's Vendor and revolutionize your food delivery experience
            </MediumText>

            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <SmallText style={styles.label}>Full name</SmallText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter first and last name"
                  placeholderTextColor="#AAAAAA"
                  value={fullName}
                  onChangeText={setFullName}
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

            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <SmallText style={styles.label}>Location</SmallText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your restaurant address"
                  placeholderTextColor="#AAAAAA"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              <View style={styles.inputUnderline} />   
            </View>

            {/* Password Requirements */}
            {/* <View style={styles.passwordRequirements}>
              <SmallText style={styles.requirementLabel}>At least:</SmallText>
              <View style={styles.requirementsRow}>
                <View style={styles.requirement}>
                  <SmallText style={[
                    styles.requirementText,
                    hasUppercase && styles.requirementMet
                  ]}>
                    Uppercase Letter
                  </SmallText>
                </View>
                <View style={styles.requirement}>
                  <SmallText style={[
                    styles.requirementText,
                    hasLowercase && styles.requirementMet
                  ]}>
                    Lowercase Letter
                  </SmallText>
                </View>
                <View style={styles.requirement}>
                  <SmallText style={[
                    styles.requirementText,
                    hasSpecialChar && styles.requirementMet
                  ]}>
                    Special Character
                  </SmallText>
                </View>
              </View>
              <View style={styles.requirementsRow}>
                <View style={styles.requirement}>
                  <SmallText style={[
                    styles.requirementText,
                    hasNumber && styles.requirementMet
                  ]}>
                    1 Number
                  </SmallText>
                </View>
                <View style={styles.requirement}>
                  <SmallText style={[
                    styles.requirementText,
                    hasMinLength && styles.requirementMet
                  ]}>
                    8 Character
                  </SmallText>
                </View>
              </View>
            </View> */}

            {/* Signup Button */}
            <TouchableOpacity 
              style={styles.signupButton}
              onPress={() => router.push('/VerifyMail')}
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
              <TouchableOpacity onPress={() => router.push('/Login')}>
                <MediumText style={styles.loginLink}>Sign In</MediumText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing * 2,
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
    fontSize: 11
  },
  requirementMet: {
    color: "#FE7622",
  },
  signupButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingVertical: Spacing * 1.5,
    alignItems: "center",
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
    fontSize: 12,
  },
  loginLink: {
    fontSize: 12,
    color: "#FE7622",
  },
});

export default SignupScreen;