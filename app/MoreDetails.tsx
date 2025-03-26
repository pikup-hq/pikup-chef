import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Modal,
} from "react-native";
import { ArrowLeft, Bell, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { AppSafeAreaView } from "../components/common/AppViews";
import {
  MediumText,
  SmallText,
  SemiBoldText,
  LargeText,
} from "../components/common/AppText";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import { DefaultButton } from "@/components/common/Button";
import { ProfileAdd } from "iconsax-react-native";
import { Ionicons } from "@expo/vector-icons";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { TimePicker } from "@/components/common/TimePicker";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import { BASE_URL } from "@/config";
import Spinner from "react-native-loading-spinner-overlay";
import * as SecureStore from "expo-secure-store";

// Add these types at the top of the file
type OperatingDays = {
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
};

type OperatingTime = {
  openingTime: string;
  closingTime: string;
};

const HOURS = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const CITIES = [
  { value: "ikole", label: "Ikole" },
  { value: "ado", label: "Ado" },
  { value: "oye", label: "Oye" },
];

const OPERATIONS = [
  { value: "food", label: "Food" },
  { value: "supermarket", label: "Super Market" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "market", label: "Market" },
  { value: "tech", label: "Tech" },
  { value: "others", label: "Others" },
];

const STATES = [
  { value: "ekiti", label: "Ekiti" },
  { value: "osun", label: "Osun" },
];

type ImageInfo = {
  uri: string;
  type?: string;
  fileName?: string;
};

interface City {
  value: string;
  label: string;
}

export default function MoreDetailsScreen() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<ImageInfo | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [showOperationPicker, setShowOperationPicker] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [operationName, setOperationName] = useState("");
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");

  const user = useAuthStore((state) => state.userInfo);
  const token = useAuthStore((state) => state.token);
  const userInfo = JSON.parse(user);

  const pickImage = async (
    setImage: (image: ImageInfo | null) => void,
    options?: ImagePicker.ImagePickerOptions
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      ...options,
    });

    if (!result.canceled) {
      const imageInfo: ImageInfo = {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        fileName: "image.jpg",
      };
      setImage(imageInfo);
    }
  };

  // State for a single opening time selector
  const [selectedDay, setSelectedDay] = useState<string>("default");
  const [openTime, setOpenTime] = useState<string>("");
  const [closeTime, setCloseTime] = useState<string>("");

  // Replace the existing opening times state with these
  const [operatingDays, setOperatingDays] = useState<OperatingDays>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const [operatingTime, setOperatingTime] = useState<OperatingTime>({
    openingTime: "",
    closingTime: "",
  });

  // Add toggle function for days
  const toggleDay = (day: keyof OperatingDays) => {
    setOperatingDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSubmit = async () => {
    if (
      !profileImage ||
      !description ||
      !address ||
      !selectedState ||
      !selectedCity ||
      !operationType
    ) {
      ErrorToast("Please fill all required fields");
      return;
    }

    const hasSelectedDays = Object.values(operatingDays).some((day) => day);
    if (!hasSelectedDays) {
      ErrorToast("Please select at least one operating day");
      return;
    }

    if (!operatingTime.openingTime || !operatingTime.closingTime) {
      ErrorToast("Please set operating hours");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        _id: userInfo._id,
        avatar: profileImage.uri,
        description,
        address,
        state: selectedState,
        city: selectedCity,
        operation: operationType,
        website: website || "",
        operatingDays,
        operatingTime: {
          openingTime: operatingTime.openingTime,
          closingTime: operatingTime.closingTime,
        },
      };

      console.log("Submitting payload:", payload);

      const response = await axios({
        method: "put",
        url: `${BASE_URL}/user/edit-restaurant`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Set moreDetails to true in SecureStore
      await SecureStore.setItemAsync("moreDetails", "true");

      router.push("/Login");
      console.log("API Response:", response.data);
      SuccessToast("Business details updated successfully");
    } catch (error: any) {
      console.error("Update failed:", error.response?.data);
      ErrorToast(
        error.response?.data?.message || "Failed to update business details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Add these state variables
  const [showOpeningTimePicker, setShowOpeningTimePicker] = useState(false);
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);

  // Add this helper function
  const getAvailableClosingTimes = (openingTime: string) => {
    if (!openingTime) return [];
    const openingIndex = HOURS.indexOf(openingTime);
    return HOURS.slice(openingIndex + 1);
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Spinner visible={submitting} overlayColor="rgba(0, 0, 0, 0.7)" />
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          //   paddingHorizontal: Spacing * 2,
          paddingVertical: Spacing,
          borderBottomWidth: 1,
          borderBottomColor: "#F4F4F4",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: Spacing, marginLeft: -Spacing }}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <SemiBoldText style={{ fontSize: 16 }}>More details</SemiBoldText>
        <TouchableOpacity
          style={{ padding: Spacing, marginRight: -Spacing }}
        ></TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: Spacing }}
      >
        {/* Profile Image */}
        <View style={{ alignItems: "center", marginBottom: Spacing * 2 }}>
          <TouchableOpacity
            style={{ marginBottom: Spacing }}
            onPress={() => pickImage(setProfileImage, { aspect: [1, 1] })}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage.uri }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#F4F4F4",
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ProfileAdd size={60} color={COLORS.primary} />
                <SmallText
                  style={{
                    color: COLORS.primary,
                    marginTop: 8,
                    fontSize: 12,
                  }}
                >
                  Tap to upload
                </SmallText>
              </View>
            )}
          </TouchableOpacity>
          <MediumText
            style={{ marginBottom: Spacing, color: "#000000", fontSize: 13 }}
          >
            Upload Image
          </MediumText>
        </View>

        {/* Description Input */}
        <View style={{ marginBottom: Spacing * 2 }}>
          <MediumText style={{ marginBottom: Spacing, color: "#000000" }}>
            Description
          </MediumText>
          <TextInput
            style={{
              fontFamily: "Sen-Regular",
              fontSize: 14,
              color: "#000000",
              paddingVertical: Spacing,
            }}
            placeholder="e.g we sell rice, chicken and goat meat"
            placeholderTextColor="#AAAAAA"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={{ height: 1, backgroundColor: COLORS.primary }} />
        </View>

        {/* Address Input */}
        <View style={{ marginBottom: Spacing * 2 }}>
          <MediumText style={{ marginBottom: Spacing, color: "#000000" }}>
            Address
          </MediumText>
          <TextInput
            style={{
              fontFamily: "Sen-Regular",
              fontSize: 14,
              color: "#000000",
              paddingVertical: Spacing,
            }}
            placeholder="e.g school road, lagos"
            placeholderTextColor="#AAAAAA"
            value={address}
            onChangeText={setAddress}
            multiline
          />
          <View style={{ height: 1, backgroundColor: COLORS.primary }} />
        </View>

        {/* State Selector */}
        <MediumText
          style={{ fontSize: 14, fontWeight: "500", marginBottom: 8 }}
        >
          State
        </MediumText>
        <TouchableOpacity
          onPress={() => setShowStatePicker(true)}
          style={{
            backgroundColor: "#F5F5F5",
            borderRadius: 8,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <MediumText
            style={{ color: selectedState ? "black" : "#999", fontSize: 14 }}
          >
            {selectedStateName || "Select your state"}
          </MediumText>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>

        {/* State Picker Modal */}
        <Modal
          visible={showStatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowStatePicker(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
            activeOpacity={1}
            onPress={() => setShowStatePicker(false)}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 16,
                maxHeight: "50%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <MediumText style={{ fontSize: 16, fontWeight: "600" }}>
                  Select State
                </MediumText>
                <TouchableOpacity onPress={() => setShowStatePicker(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {STATES.map((state) => (
                  <TouchableOpacity
                    key={state.value}
                    onPress={() => {
                      setSelectedState(state.value);
                      setSelectedStateName(state.label);
                      setShowStatePicker(false);
                    }}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MediumText style={{ flex: 1 }}>{state.label}</MediumText>
                    {selectedState === state.value && (
                      <Ionicons
                        name="checkmark"
                        size={24}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* City Picker Modal */}
        <MediumText
          style={{ fontSize: 14, fontWeight: "500", marginBottom: 8 }}
        >
          City
        </MediumText>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={{
            backgroundColor: "#F5F5F5",
            borderRadius: 8,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <MediumText
            style={{ color: selectedCity ? "black" : "#999", fontSize: 14 }}
          >
            {selectedCityName || "Please select your city"}
          </MediumText>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>

        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
            activeOpacity={1}
            onPress={() => setShowPicker(false)}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 16,
                maxHeight: "50%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <MediumText style={{ fontSize: 16, fontWeight: "600" }}>
                  Select City
                </MediumText>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city.value}
                    onPress={() => {
                      setSelectedCity(city.value);
                      setSelectedCityName(city.label);
                      setShowPicker(false);
                    }}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MediumText style={{ flex: 1 }}>{city.label}</MediumText>
                    {selectedCity === city.value && (
                      <Ionicons
                        name="checkmark"
                        size={24}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Operation Type Selector */}
        <MediumText
          style={{ fontSize: 14, fontWeight: "500", marginBottom: 8 }}
        >
          Operation Type
        </MediumText>
        <TouchableOpacity
          onPress={() => setShowOperationPicker(true)}
          style={{
            backgroundColor: "#F5F5F5",
            borderRadius: 8,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <MediumText
            style={{ color: operationType ? "black" : "#999", fontSize: 14 }}
          >
            {operationName || "Select operation type"}
          </MediumText>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>

        {/* Operation Type Modal */}
        <Modal
          visible={showOperationPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowOperationPicker(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
            activeOpacity={1}
            onPress={() => setShowOperationPicker(false)}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 16,
                maxHeight: "50%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <MediumText style={{ fontSize: 16, fontWeight: "600" }}>
                  Select Operation Type
                </MediumText>
                <TouchableOpacity onPress={() => setShowOperationPicker(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {OPERATIONS.map((operation) => (
                  <TouchableOpacity
                    key={operation.value}
                    onPress={() => {
                      setOperationType(operation.value);
                      setOperationName(operation.label);
                      setShowOperationPicker(false);
                    }}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MediumText style={{ flex: 1 }}>
                      {operation.label}
                    </MediumText>
                    {operationType === operation.value && (
                      <Ionicons
                        name="checkmark"
                        size={24}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Website Input (Optional) */}
        <View style={{ marginBottom: Spacing * 2 }}>
          <MediumText style={{ marginBottom: Spacing, color: "#000000" }}>
            Website (Optional)
          </MediumText>
          <TextInput
            style={{
              fontFamily: "Sen-Regular",
              fontSize: 14,
              color: "#000000",
              paddingVertical: Spacing,
            }}
            placeholder="e.g www.yourwebsite.com"
            placeholderTextColor="#AAAAAA"
            value={website}
            onChangeText={setWebsite}
          />
          <View style={{ height: 1, backgroundColor: COLORS.primary }} />
        </View>

        {/* Operating Days */}
        <View style={{ marginBottom: Spacing * 2 }}>
          <MediumText style={{ marginBottom: Spacing }}>
            Operating Days
          </MediumText>
          {Object.keys(operatingDays).map((day) => (
            <TouchableOpacity
              key={day}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: Spacing,
                backgroundColor: operatingDays[day as keyof OperatingDays]
                  ? "#E8F5E9"
                  : "#F5F5F5",
                borderRadius: 8,
                marginBottom: 8,
              }}
              onPress={() => toggleDay(day as keyof OperatingDays)}
            >
              <MediumText style={{ flex: 1 }}>{day}</MediumText>
              <Ionicons
                name={
                  operatingDays[day as keyof OperatingDays]
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={24}
                color={
                  operatingDays[day as keyof OperatingDays]
                    ? COLORS.primary
                    : "#999"
                }
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Operating Time */}
        <View style={{ marginBottom: Spacing * 2 }}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <MediumText style={{ marginBottom: 8 }}>Opening Time</MediumText>
              <TouchableOpacity
                style={{
                  backgroundColor: "#F5F5F5",
                  padding: 16,
                  borderRadius: 8,
                }}
                onPress={() => setShowOpeningTimePicker(true)}
              >
                <MediumText style={{}}>
                  {operatingTime.openingTime || "Select time"}
                </MediumText>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <MediumText style={{ marginBottom: 8 }}>Closing Time</MediumText>
              <TouchableOpacity
                style={{
                  backgroundColor: "#F5F5F5",
                  padding: 16,
                  borderRadius: 8,
                }}
                onPress={() => setShowClosingTimePicker(true)}
              >
                <MediumText style={{}}>
                  {operatingTime.closingTime || "Select time"}
                </MediumText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <DefaultButton onPress={handleSubmit} title="Continue" />
      </ScrollView>

      {/* Time Picker Modals */}
      <TimePicker
        visible={showOpeningTimePicker}
        onClose={() => setShowOpeningTimePicker(false)}
        onSelect={(time) => {
          setOperatingTime((prev) => ({ ...prev, openingTime: time }));
        }}
        title="Select Opening Time"
      />

      <TimePicker
        visible={showClosingTimePicker}
        onClose={() => setShowClosingTimePicker(false)}
        onSelect={(time) => {
          setOperatingTime((prev) => ({ ...prev, closingTime: time }));
        }}
        title="Select Closing Time"
      />
    </AppSafeAreaView>
  );
}
