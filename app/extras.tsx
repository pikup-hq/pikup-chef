import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Plus, Layers, Pencil, Trash2, Camera, X } from "lucide-react-native";
import { MediumText, SmallText, SemiBoldText } from "@/components/common/AppText";
import ScreenHeader from "@/components/ScreenHeader";
import NoDataView from "@/components/NoDataView";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { extrasApi } from "@/services/extras";
import { getErrorMessage } from "@/services/api";
import { pickAndUploadImage } from "@/utilities/cloudinary";
import { naira } from "@/utilities/format";
import type { Extra } from "@/types";

interface FormState {
  id?: string;
  name: string;
  price: string;
  image?: string;
  available: boolean;
}

const EMPTY_FORM: FormState = { name: "", price: "", available: true };

const inputStyle = {
  backgroundColor: "#F4F4F4",
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontFamily: "Sen-Regular",
  fontSize: 14,
};

export default function ExtrasScreen() {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      setExtras(await extrasApi.mine());
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not load extras"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openEditor = (extra?: Extra) =>
    setForm(
      extra
        ? { id: extra._id, name: extra.name, price: String(extra.price), image: extra.image, available: extra.available }
        : { ...EMPTY_FORM }
    );

  const pickImage = async () => {
    try {
      setUploading(true);
      const url = await pickAndUploadImage({}, "extra");
      if (url) setForm((f) => (f ? { ...f, image: url } : f));
    } catch (error: any) {
      ErrorToast(error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form) return;
    const price = Number(form.price.replace(/[^\d.]/g, ""));
    if (!form.name.trim()) return ErrorToast("Give the extra a name");
    if (!Number.isFinite(price) || price < 0 || form.price.trim() === "") {
      return ErrorToast("Enter a valid price");
    }

    setSaving(true);
    try {
      const input = { name: form.name.trim(), price, image: form.image, available: form.available };
      if (form.id) {
        const updated = await extrasApi.update(form.id, input);
        setExtras((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
        SuccessToast("Extra updated");
      } else {
        const created = await extrasApi.create(input);
        setExtras((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        SuccessToast(`${created.name} added`);
      }
      setForm(null);
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not save extra"));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (extra: Extra) => {
    const next = !extra.available;
    setTogglingId(extra._id);
    setExtras((prev) => prev.map((e) => (e._id === extra._id ? { ...e, available: next } : e)));
    try {
      await extrasApi.update(extra._id, { available: next });
    } catch (error) {
      setExtras((prev) => prev.map((e) => (e._id === extra._id ? { ...e, available: !next } : e)));
      ErrorToast(getErrorMessage(error, "Could not update extra"));
    } finally {
      setTogglingId(null);
    }
  };

  const remove = (extra: Extra) =>
    Alert.alert("Delete extra", `Delete "${extra.name}"? It will be removed from every menu item.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await extrasApi.remove(extra._id);
            setExtras((prev) => prev.filter((e) => e._id !== extra._id));
            SuccessToast("Extra deleted");
          } catch (error) {
            ErrorToast(getErrorMessage(error, "Could not delete extra"));
          }
        },
      },
    ]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <ScreenHeader
        title="Extras"
        subtitle="Add-ons customers can pick with a dish"
        right={
          <TouchableOpacity onPress={() => openEditor()} hitSlop={10} accessibilityLabel="Add extra">
            <Plus size={24} color={COLORS.secondary} />
          </TouchableOpacity>
        }
      />

      {loading ? (
        <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={extras}
          keyExtractor={(e) => e._id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          ListEmptyComponent={
            <View>
              <NoDataView
                message={'No extras yet. Create add-ons like "Extra meat" or "Plantain", then attach them to menu items.'}
                icon={<Layers size={48} color="#CCCCCC" />}
              />
              <TouchableOpacity
                onPress={() => openEditor()}
                style={{ backgroundColor: COLORS.primary, padding: 14, borderRadius: 10, alignItems: "center" }}
              >
                <SemiBoldText style={{ color: "#FFF" }}>Add your first extra</SemiBoldText>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                marginBottom: 12,
                backgroundColor: `${COLORS.grey}50`,
                borderRadius: 12,
              }}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }} />
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12, backgroundColor: COLORS.lightOrange, alignItems: "center", justifyContent: "center" }}>
                  <Layers size={20} color={COLORS.secondary} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <SemiBoldText numberOfLines={1}>{item.name}</SemiBoldText>
                <MediumText style={{ fontSize: 13 }}>{naira(item.price)}</MediumText>
              </View>
              <Switch
                value={item.available}
                onValueChange={() => toggle(item)}
                disabled={togglingId === item._id}
                trackColor={{ false: "#D1D1D1", true: `${COLORS.secondary}50` }}
                thumbColor={item.available ? COLORS.secondary : "#F4F4F4"}
              />
              <TouchableOpacity onPress={() => openEditor(item)} style={{ marginLeft: 12 }} hitSlop={8} accessibilityLabel={`Edit ${item.name}`}>
                <Pencil size={18} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(item)} style={{ marginLeft: 14 }} hitSlop={8} accessibilityLabel={`Delete ${item.name}`}>
                <Trash2 size={18} color="#EB5757" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Modal visible={!!form} transparent animationType="slide" onRequestClose={() => setForm(null)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <SemiBoldText style={{ fontSize: 16 }}>{form?.id ? "Edit extra" : "New extra"}</SemiBoldText>
              <TouchableOpacity onPress={() => setForm(null)} hitSlop={10}>
                <X size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={pickImage} disabled={uploading} style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
              {form?.image ? (
                <Image source={{ uri: form.image }} style={{ width: 56, height: 56, borderRadius: 8 }} />
              ) : (
                <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: "#F4F4F4", alignItems: "center", justifyContent: "center" }}>
                  {uploading ? <ActivityIndicator color={COLORS.secondary} /> : <Camera size={22} color={COLORS.primary} />}
                </View>
              )}
              <SmallText style={{ color: COLORS.primary }}>
                {form?.image ? "Change image (optional)" : "Add image (optional)"}
              </SmallText>
            </TouchableOpacity>

            <SmallText style={{ marginBottom: 6 }}>Name</SmallText>
            <TextInput
              value={form?.name}
              onChangeText={(name) => setForm((f) => (f ? { ...f, name } : f))}
              placeholder="e.g. Extra meat"
              style={[inputStyle, { marginBottom: 14 }]}
            />
            <SmallText style={{ marginBottom: 6 }}>Price (₦)</SmallText>
            <TextInput
              value={form?.price}
              onChangeText={(price) => setForm((f) => (f ? { ...f, price } : f))}
              placeholder="500"
              keyboardType="numeric"
              style={[inputStyle, { marginBottom: 14 }]}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <SmallText>Available</SmallText>
              <Switch
                value={form?.available ?? true}
                onValueChange={(available) => setForm((f) => (f ? { ...f, available } : f))}
                trackColor={{ false: "#D1D1D1", true: `${COLORS.secondary}50` }}
                thumbColor={form?.available ? COLORS.secondary : "#F4F4F4"}
              />
            </View>

            <TouchableOpacity
              onPress={save}
              disabled={saving || uploading}
              style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 8, alignItems: "center", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? <ActivityIndicator color="#FFF" /> : <SemiBoldText style={{ color: "#FFF" }}>Save extra</SemiBoldText>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
