import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { BookOpen, Plus, Layers, Trash2 } from "lucide-react-native";
import { MediumText, SmallText, SemiBoldText } from "@/components/common/AppText";
import NoDataView from "@/components/NoDataView";
import ScreenHeader from "@/components/ScreenHeader";
import NotificationBell from "@/components/NotificationBell";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import useAuthStore from "@/store/authStore";
import { menuApi } from "@/services/menu";
import { getErrorMessage } from "@/services/api";
import { naira } from "@/utilities/format";
import type { MenuItem } from "@/types";

interface MenuRowProps {
  item: MenuItem;
  isUpdating: boolean;
  onToggle: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

const MenuRow: React.FC<MenuRowProps> = ({ item, isUpdating, onToggle, onEdit, onDelete }) => {
  const extrasCount = item.extras?.length || 0;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onEdit(item)}
      style={{
        flexDirection: "row",
        padding: 12,
        marginBottom: 16,
        backgroundColor: `${COLORS.grey}50`,
        borderRadius: 12,
        opacity: item.available ? 1 : 0.75,
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12, backgroundColor: COLORS.grey }}
      />
      <View style={{ flex: 1 }}>
        <SemiBoldText numberOfLines={1}>{item.name}</SemiBoldText>
        <SmallText style={{ color: "#666666", fontSize: 13 }} numberOfLines={2}>
          {item.description}
        </SmallText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
          <MediumText>{naira(item.price)}</MediumText>
          {extrasCount > 0 && (
            <View style={{ backgroundColor: COLORS.lightOrange, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
              <SmallText style={{ color: COLORS.secondary, fontSize: 11 }}>
                +{extrasCount} extra{extrasCount === 1 ? "" : "s"}
              </SmallText>
            </View>
          )}
        </View>
      </View>
      <View style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
        <View style={{ alignItems: "flex-end" }}>
          <SmallText style={{ color: item.available ? "green" : "red", fontSize: 12 }}>
            {item.available ? "Available" : "Unavailable"}
          </SmallText>
          <Switch
            value={item.available}
            onValueChange={() => onToggle(item)}
            disabled={isUpdating}
            trackColor={{ false: "#D1D1D1", true: `${COLORS.secondary}50` }}
            thumbColor={item.available ? COLORS.secondary : "#F4F4F4"}
          />
        </View>
        <TouchableOpacity onPress={() => onDelete(item)} hitSlop={10} accessibilityLabel={`Delete ${item.name}`}>
          <Trash2 size={18} color="#EB5757" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function MenuScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const userInfo = useAuthStore((s) => s.userInfo);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!userInfo?._id) return;
      if (isRefresh) setRefreshing(true);
      try {
        setMenu(await menuApi.list(userInfo._id));
      } catch (error) {
        ErrorToast(getErrorMessage(error, "Failed to fetch menu"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userInfo?._id]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const toggle = async (item: MenuItem) => {
    const next = !item.available;
    setUpdatingId(item._id);
    setMenu((prev) => prev.map((m) => (m._id === item._id ? { ...m, available: next } : m)));
    try {
      await menuApi.setAvailability(item._id, next);
    } catch (error) {
      setMenu((prev) => prev.map((m) => (m._id === item._id ? { ...m, available: !next } : m)));
      ErrorToast(getErrorMessage(error, "Failed to update availability"));
    } finally {
      setUpdatingId(null);
    }
  };

  const remove = (item: MenuItem) => {
    Alert.alert("Delete menu item", `Remove "${item.name}" from your menu?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await menuApi.remove(item._id);
            setMenu((prev) => prev.filter((m) => m._id !== item._id));
            SuccessToast(`${item.name} deleted`);
          } catch (error) {
            ErrorToast(getErrorMessage(error, "Failed to delete item"));
          }
        },
      },
    ]);
  };

  const edit = (item: MenuItem) =>
    router.push({ pathname: "/AddMenu", params: { id: item._id, menuData: JSON.stringify(item) } });

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
        title="Menu"
        subtitle="Customize your menu"
        showBack={false}
        right={<NotificationBell color={COLORS.secondary} />}
      />

      <View style={{ flexDirection: "row", gap: 10, paddingTop: 16, paddingBottom: 8 }}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/AddMenu", params: { id: "new" } })}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            backgroundColor: COLORS.primary,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <Plus size={16} color="#FFF" />
          <SmallText style={{ color: "#FFF" }}>Add menu item</SmallText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/extras")}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            backgroundColor: COLORS.lightOrange,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <Layers size={16} color={COLORS.secondary} />
          <SmallText style={{ color: COLORS.secondary }}>Manage extras</SmallText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(m) => m._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          ListEmptyComponent={
            <NoDataView message="No menu yet. Add your first dish." icon={<BookOpen size={48} color="#CCCCCC" />} />
          }
          renderItem={({ item }) => (
            <MenuRow
              item={item}
              isUpdating={updatingId === item._id}
              onToggle={toggle}
              onEdit={edit}
              onDelete={remove}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
