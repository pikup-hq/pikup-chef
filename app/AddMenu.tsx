import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Switch,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Camera, Check, Plus } from "lucide-react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { MediumText, SmallText, SemiBoldText } from "@/components/common/AppText";
import ScreenHeader from "@/components/ScreenHeader";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { menuApi } from "@/services/menu";
import { extrasApi } from "@/services/extras";
import { getErrorMessage } from "@/services/api";
import { pickAndUploadImage } from "@/utilities/cloudinary";
import { naira } from "@/utilities/format";
import type { Extra, MenuItem } from "@/types";

const inputBox = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  backgroundColor: "#F4F4F4",
  borderRadius: 8,
  paddingHorizontal: 16,
};
const inputText = { flex: 1, paddingVertical: 12, fontFamily: "Sen-Regular", fontSize: 14 };

export default function EditMenuScreen() {
  const router = useRouter();
  const { id, menuData } = useLocalSearchParams<{ id: string; menuData?: string }>();
  const isNew = !id || id === "new";

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);

  const [allExtras, setAllExtras] = useState<Extra[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [extrasLoading, setExtrasLoading] = useState(true);

  useEffect(() => {
    if (!menuData) return;
    try {
      const parsed: MenuItem = JSON.parse(menuData);
      setName(parsed.name);
      setDescription(parsed.description);
      setPrice(String(parsed.price ?? ""));
      setImage(parsed.image);
      setAvailable(parsed.available !== false);
      setSelectedExtras((parsed.extras || []).map((e) => e._id));
    } catch {
      ErrorToast("Could not load this menu item");
    }
  }, [menuData]);

  // Refresh on focus so extras created on the Extras screen show up immediately.
  useFocusEffect(
    useCallback(() => {
      extrasApi
        .mine()
        .then(setAllExtras)
        .catch((error) => ErrorToast(getErrorMessage(error, "Could not load extras")))
        .finally(() => setExtrasLoading(false));
    }, [])
  );

  const pickImage = async () => {
    try {
      setUploading(true);
      const url = await pickAndUploadImage();
      if (url) {
        setImage(url);
        SuccessToast("Image uploaded successfully");
      }
    } catch (error: any) {
      ErrorToast(error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const toggleExtra = (extraId: string) =>
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((x) => x !== extraId) : [...prev, extraId]
    );

  const handleSubmit = async () => {
    const numericPrice = Number(price.replace(/[^\d.]/g, ""));
    if (!name.trim() || !description.trim() || !image) {
      ErrorToast("Please fill all required fields and upload an image");
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      ErrorToast("Enter a valid price");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        image,
        available,
      };
      const saved = isNew ? await menuApi.create(payload) : await menuApi.update(String(id), payload);
      const menuId = saved?._id || String(id);
      await menuApi.setExtras(menuId, selectedExtras);

      SuccessToast(isNew ? "Menu added" : "Menu updated");
      router.back();
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Operation failed"));
    } finally {
      setSubmitting(false);
    }
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
      <Spinner visible={uploading} overlayColor="rgba(0, 0, 0, 0.7)" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScreenHeader
          title={isNew ? "Add Menu" : "Edit menu item"}
          subtitle={isNew ? "Add a new menu item" : "Make some changes in your menu"}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginBottom: 24 }}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 8 }} />
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
              {image ? "Change image" : "Upload menu image"}
            </MediumText>
            <SmallText style={{ color: "#666666", marginTop: 4, fontSize: 12 }}>
              JPG or PNG, less than 5MB • square (1:1)
            </SmallText>
          </TouchableOpacity>

          <View style={{ gap: 20 }}>
            <View>
              <SmallText style={{ marginBottom: 8 }}>Name</SmallText>
              <View style={inputBox}>
                <TextInput value={name} onChangeText={setName} placeholder="Name of Menu Item" style={inputText} />
              </View>
            </View>

            <View>
              <SmallText style={{ marginBottom: 8 }}>Description</SmallText>
              <View style={inputBox}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Include if a spoon or portion or a plate"
                  multiline
                  numberOfLines={3}
                  style={[inputText, { textAlignVertical: "top", minHeight: 70 }]}
                />
              </View>
            </View>

            <View>
              <SmallText style={{ marginBottom: 8 }}>Price (₦)</SmallText>
              <View style={inputBox}>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="3000"
                  keyboardType="numeric"
                  style={inputText}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <SmallText>Available to order</SmallText>
                <SmallText style={{ color: "#666", fontSize: 12 }}>Customers can see and order this item</SmallText>
              </View>
              <Switch
                value={available}
                onValueChange={setAvailable}
                trackColor={{ false: "#D1D1D1", true: `${COLORS.secondary}50` }}
                thumbColor={available ? COLORS.secondary : "#F4F4F4"}
              />
            </View>

            {/* Extras */}
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <SmallText>Extras for this item</SmallText>
                <TouchableOpacity onPress={() => router.push("/extras")} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Plus size={14} color={COLORS.secondary} />
                  <SmallText style={{ color: COLORS.secondary, fontSize: 13 }}>Manage extras</SmallText>
                </TouchableOpacity>
              </View>
              {extrasLoading ? (
                <ActivityIndicator color={COLORS.secondary} />
              ) : allExtras.length === 0 ? (
                <SmallText style={{ color: "#666", fontSize: 13 }}>
                  You haven't created any extras yet. Add extras like "Extra meat" or "Plantain" so
                  customers can add them to this dish.
                </SmallText>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {allExtras.map((extra) => {
                    const selected = selectedExtras.includes(extra._id);
                    return (
                      <TouchableOpacity
                        key={extra._id}
                        onPress={() => toggleExtra(extra._id)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: selected ? COLORS.secondary : "#DDD",
                          backgroundColor: selected ? COLORS.lightOrange : "#FFF",
                          opacity: extra.available ? 1 : 0.5,
                        }}
                      >
                        {selected && <Check size={14} color={COLORS.secondary} />}
                        <SmallText style={{ fontSize: 13, color: selected ? COLORS.secondary : "#333" }}>
                          {extra.name} • {naira(extra.price)}
                        </SmallText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={{ paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#F4F4F4" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#1A1A1A",
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
              opacity: submitting ? 0.7 : 1,
            }}
            onPress={handleSubmit}
            disabled={submitting || uploading}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <SemiBoldText style={{ color: "#FFFFFF" }}>{isNew ? "Add to menu" : "Save Changes"}</SemiBoldText>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
