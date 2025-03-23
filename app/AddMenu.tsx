import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Bell, Camera, Edit2 } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Spinner from "react-native-loading-spinner-overlay";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  MediumText,
  SmallText,
  SemiBoldText,
} from "@/components/common/AppText";
import { MenuItem } from "@/hooks/data/menu";
import COLORS from "@/constants/colors";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { UseAuth } from "@/hooks/apis";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { BASE_URL } from "@/config";

export default function EditMenuScreen() {
  const router = useRouter();
  const { id, menuData } = useLocalSearchParams();
  const [submitting, setSubmitting] = useState(false);

  // Individual state variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [menuId, setMenuId] = useState<string | null>(null);

  const user = useAuthStore((state) => state.userInfo);
  const token = useAuthStore((state) => state.token);
  const userInfo = JSON.parse(user);

  useEffect(() => {
    if (menuData) {
      const parsedMenu = JSON.parse(menuData as string);
      setName(parsedMenu.name);
      setDescription(parsedMenu.description);
      setPrice(parsedMenu.price.toString());
      setImage(parsedMenu.image);
      setMenuId(parsedMenu._id); // Set menuId from parsed data
    }
  }, [menuData]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      ErrorToast("Failed to pick image");
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || !image) {
      ErrorToast("Please fill all required fields and upload an image");
      return;
    }

    setSubmitting(true);

    try {
      // Create payload from state values
      const menuPayload = {
        name,
        description,
        price: Number(price),
        image,
        available: true,
      };

      // Log payload for debugging
      console.log("Menu Payload:", {
        ...menuPayload,
        isEdit: id !== "new",
      });

      const endpoint =
        id !== "new"
          ? `${BASE_URL}/product/edit/${menuId}`
          : `${BASE_URL}/product`;

      const response = await axios({
        method: id !== "new" ? "put" : "post",
        url: endpoint,
        data: menuPayload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);
      SuccessToast(id !== "new" ? "Menu updated" : "Menu added");
      router.back();
    } catch (error: any) {
      console.error("Operation failed:", {
        error: error.response?.data,
        status: error.response?.status,
      });
      ErrorToast(error.response?.data?.error || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Spinner visible={submitting} overlayColor="rgba(0, 0, 0, 0.7)" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 16,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#F4F4F4",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <SemiBoldText style={{ fontSize: 16 }}>
            {id !== "new" ? "Edit" : "Add Menu"}
          </SemiBoldText>
          <SmallText style={{ color: "#666666", fontSize: 13 }}>
            {id !== "new"
              ? "Make some changes in your menu"
              : "Add a new menu item"}
          </SmallText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16 }}
      >
        {/* Image Upload */}
        <TouchableOpacity
          onPress={pickImage}
          style={{
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#F4F4F4",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Camera size={32} color={COLORS.primary} />
            </View>
          )}
          <MediumText style={{ color: COLORS.primary }}>
            Upload menu image
          </MediumText>
          <SmallText style={{ color: "#666666", marginTop: 4, fontSize: 12 }}>
            Allowed formats jpg &mp4 less than 5mb
          </SmallText>
          <SmallText
            style={{
              backgroundColor: "#E8F0FE",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              marginTop: 8,
              fontSize: 13,
            }}
          >
            1 x 1 Aspect ratio
          </SmallText>
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={{ gap: 24 }}>
          {/* Name Input */}
          <View>
            <SmallText style={{ marginBottom: 8 }}>Name</SmallText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F4F4F4",
                borderRadius: 8,
                paddingHorizontal: 16,
              }}
            >
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Jollof Rice and Chicken"
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  fontFamily: "Sen-Regular",
                  fontSize: 14,
                }}
              />
            </View>
          </View>

          {/* Description Input */}
          <View>
            <SmallText style={{ marginBottom: 8 }}>Description</SmallText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F4F4F4",
                borderRadius: 8,
                paddingHorizontal: 16,
              }}
            >
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                multiline
                numberOfLines={3}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  fontFamily: "Sen-Regular",
                  fontSize: 14,
                  textAlignVertical: "top",
                }}
              />
            </View>
          </View>

          {/* Price Input */}
          <View>
            <SmallText style={{ marginBottom: 8 }}>Price</SmallText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F4F4F4",
                borderRadius: 8,
                paddingHorizontal: 16,
              }}
            >
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="₦3000"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  fontFamily: "Sen-Regular",
                  fontSize: 14,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={{ paddingVertical: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#1A1A1A",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            opacity: submitting ? 0.7 : 1,
          }}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <SemiBoldText style={{ color: "#FFFFFF" }}>
              Save Changes
            </SemiBoldText>
          )}
        </TouchableOpacity>
      </View>
    </AppSafeAreaView>
  );
}
