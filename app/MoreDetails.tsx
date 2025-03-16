import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
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
import OpeningTimesSelector, {
  OpeningTime,
  DAYS,
  TIME_OPTIONS,
} from "@/components/OpeningTimeSelector";
import { Ionicons } from "@expo/vector-icons";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";

const CITIES = [
  { value: "ikole", label: "Ikole" },
  { value: "ado", label: "Ado" },
  { value: "oye", label: "Oye" },
];

type ImageInfo = {
  uri: string;
  type?: string;
  fileName?: string;
};

export default function MoreDetailsScreen() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<ImageInfo | null>(null);
  const [restaurantName, setRestaurantName] = useState("");

  const [showPicker, setShowPicker] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

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

  // State for multiple opening times
  const [openingTimes, setOpeningTimes] = useState<OpeningTime[]>([]);

  // Add current selection to the list
  const handleAddOpeningTime = () => {
    // Validate inputs
    if (!selectedDay || !openTime || !closeTime) {
      ErrorToast("Please select day, opening and closing times");
      return;
    }

    // Check if this day already exists
    const existingIndex = openingTimes.findIndex(
      (time) => time.day === selectedDay
    );

    if (existingIndex >= 0) {
      // Update existing entry
      const updatedTimes = [...openingTimes];
      updatedTimes[existingIndex] = { day: selectedDay, openTime, closeTime };
      setOpeningTimes(updatedTimes);
    } else {
      // Add new entry
      setOpeningTimes([
        ...openingTimes,
        { day: selectedDay, openTime, closeTime },
      ]);
    }

    // Reset form
    setSelectedDay("default");
    setOpenTime("");
    setCloseTime("");
  };

  // Remove an opening time
  const handleRemoveOpeningTime = (index: number) => {
    const updatedTimes = [...openingTimes];
    updatedTimes.splice(index, 1);
    setOpeningTimes(updatedTimes);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate all required fields
    if (!profileImage) {
      ErrorToast("Please add a profile image");
      return;
    }

    if (!restaurantName) {
      ErrorToast("Please add a restaurant name");
      return;
    }

    if (!description) {
      ErrorToast("Please add a description");
      return;
    }

    if (!address) {
      ErrorToast("Please add an address");
      return;
    }

    if (openingTimes.length === 0) {
      ErrorToast("Please add at least one opening time");
      return;
    }

    if (!selectedCity) {
      ErrorToast("Please select a city");
      return;
    }

    // If all validations pass, format and submit data
    const formattedData = {
      profileImage,
      restaurantName,
      description,
      address,
      city: selectedCity,
      businessHours: openingTimes.map((time) => ({
        day: time.day,
        openingTime: time.openTime,
        closingTime: time.closeTime,
      })),
    };

    // Log formatted data
    console.log(
      "Submitting form data:",
      JSON.stringify(formattedData, null, 2)
    );

    // Mock API call
    SuccessToast("Business details saved successfully");
    router.push("/(tabs)");
  };

  // Helper function to get day label
  const getDayLabel = (value: string) => {
    const day = DAYS.find((d) => d.value === value);
    return day ? day.label : value;
  };

  // Helper function to get time label
  const getTimeLabel = (value: string) => {
    const time = TIME_OPTIONS.find((t) => t.value === value);
    return time ? time.label : value;
  };

  return (
    <AppSafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF", paddingBottom: 20 }}
    >
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
        <TouchableOpacity style={{ padding: Spacing, marginRight: -Spacing }}>
          <Bell size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing }}
      >
        {/* Profile Image */}
        <TouchableOpacity
          style={{ alignSelf: "center", marginBottom: Spacing }}
          onPress={() => pickImage(setProfileImage, { aspect: [1, 1] })}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage.uri }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#F4F4F4",
                borderWidth: 1,
                borderColor: COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ProfileAdd size={50} color={COLORS.primary} />
            </View>
          )}
        </TouchableOpacity>

        {/* Description Input */}
        <View style={{ marginBottom: Spacing * 2 }}>
          <MediumText style={{ marginBottom: Spacing, color: "#000000" }}>
            Restaurant Name
          </MediumText>
          <TextInput
            style={{
              fontFamily: "Sen-Regular",
              fontSize: 14,
              color: "#000000",
              paddingVertical: Spacing,
            }}
            placeholder="wetin be our store name😅"
            placeholderTextColor="#AAAAAA"
            value={restaurantName}
            onChangeText={setRestaurantName}
            multiline
          />
          <View style={{ height: 1, backgroundColor: COLORS.primary }} />
        </View>

        {/* Description Input */}
        <View style={{ marginBottom: Spacing * 2 }}>
          <MediumText style={{ marginBottom: Spacing, color: "#000000" }}>
            Add description
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

        {/* Description Input */}
        <View style={{ marginBottom: Spacing * 2 }}>
          <MediumText style={{ marginBottom: Spacing, color: "#000000" }}>
            Add Address
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
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={{ height: 1, backgroundColor: COLORS.primary }} />
        </View>

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

        {showPicker && (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#eee",
              marginBottom: 20,
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
          >
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
                }}
              >
                <MediumText style={{}}>{city.label}</MediumText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <MediumText style={{ marginBottom: Spacing * 2 }}>
          Business Hours
        </MediumText>

        {/* Opening Times Selector */}
        <OpeningTimesSelector
          selectedDay={selectedDay}
          openTime={openTime}
          closeTime={closeTime}
          onDayChange={setSelectedDay}
          onOpenTimeChange={setOpenTime}
          onCloseTimeChange={setCloseTime}
        />
        {/* Add Button */}
        <TouchableOpacity
          style={{
            borderColor: COLORS.primary,
            borderWidth: 1,
            padding: Spacing,
            borderRadius: 8,
            alignItems: "center",
            marginTop: Spacing,
            marginBottom: Spacing * 2,
          }}
          onPress={handleAddOpeningTime}
        >
          <SemiBoldText style={{ fontSize: 13 }}>Add Opening Time</SemiBoldText>
        </TouchableOpacity>

        {/* List of Added Opening Times */}
        {openingTimes.length > 0 && (
          <View style={{ marginBottom: Spacing * 2 }}>
            <SemiBoldText style={{ marginBottom: Spacing }}>
              Added Opening Times
            </SemiBoldText>

            {openingTimes.map((time, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: Spacing,
                  backgroundColor: "#F8F8F8",
                  borderRadius: 8,
                  marginBottom: Spacing,
                }}
              >
                <View>
                  <MediumText style={{ fontWeight: "600" }}>
                    {getDayLabel(time.day)}
                  </MediumText>
                  <MediumText style={{}}>
                    {getTimeLabel(time.openTime)} -{" "}
                    {getTimeLabel(time.closeTime)}
                  </MediumText>
                </View>

                <TouchableOpacity
                  style={{
                    padding: Spacing / 2,
                    backgroundColor: "#FFE5E5",
                    borderRadius: 4,
                  }}
                  onPress={() => handleRemoveOpeningTime(index)}
                >
                  <MediumText style={{ color: "#FF4040" }}>Remove</MediumText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <DefaultButton onPress={handleSubmit} title="Continue" />
      </ScrollView>
    </AppSafeAreaView>
  );
}
