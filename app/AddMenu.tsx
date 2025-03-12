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
import { menuData, MenuItem } from "@/hooks/data/menu";
import COLORS from "@/constants/colors";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";

interface FormData {
  name: string;
  description: string;
  price: string;
  image: string | null;
}

export default function EditMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEdit = id !== "new";

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  useEffect(() => {
    if (isEdit) {
      const loadMenuItem = async () => {
        try {
          setLoading(true);
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const item = menuData.find((m: MenuItem) => m.id === id);
          if (item) {
            setFormData({
              name: item.name,
              description: item.description,
              price: item.price.toString(),
              image: item.image,
            });
          }
        } catch (error) {
          ErrorToast("Failed to load menu item");
          router.back();
        } finally {
          SuccessToast("Menu item loaded successfully");
          setLoading(false);
        }
      };

      loadMenuItem();
    }
  }, [id, isEdit]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          image: result.assets[0].uri,
        }));
      }
    } catch (error) {
      ErrorToast("Failed to pick image");
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      ErrorToast("Please enter a name");
      return;
    }
    if (!formData.description.trim()) {
      ErrorToast("Please enter a description");
      return;
    }
    if (!formData.price.trim()) {
      ErrorToast("Please enter a price");
      return;
    }
    if (!formData.image) {
      ErrorToast("Please upload an image");
      return;
    }

    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        "Success",
        `Menu item ${isEdit ? "updated" : "created"} successfully`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        `Failed to ${isEdit ? "update" : "create"} menu item`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Spinner visible={loading} overlayColor="rgba(0, 0, 0, 0.7)" />

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
            {isEdit ? "Edit" : "Add Menu"}
          </SemiBoldText>
          <SmallText style={{ color: "#666666", fontSize: 13 }}>
            {isEdit ? "Make some changes in your menu" : "Add a new menu item"}
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
          {formData.image ? (
            <Image
              source={{ uri: formData.image }}
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
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
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
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
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
                value={formData.price}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, price: text }))
                }
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
      <View style={{ padding: 16 }}>
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
