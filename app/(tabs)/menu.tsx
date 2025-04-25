import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, BookOpen } from "lucide-react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  MediumText,
  SmallText,
  SemiBoldText,
} from "@/components/common/AppText";
import NoDataView from "@/components/NoDataView";
import { MenuItem } from "@/hooks/data/menu";
import COLORS from "../../constants/colors";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { UseAuth } from "@/hooks/apis";
import useAuthStore from "@/store/authStore";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { BASE_URL } from "@/config";
import axios from "axios";
import Spacing from "@/constants/Spacing";

interface MenuItemProps {
  item: MenuItem;
  onToggleAvailability: (_id: string, newValue: boolean) => Promise<void>;
  onEdit: (id: string) => void;
  isUpdating: boolean;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  onToggleAvailability,
  onEdit,
  isUpdating,
}) => {
  const handleToggle = async () => {
    try {
      await onToggleAvailability(item._id, !item.available);
    } catch (error) {
      Alert.alert("Error", "Failed to update availability");
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 12,
        marginBottom: 16,
        backgroundColor: `${COLORS.grey}50`,
        borderRadius: 12,
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          marginRight: 12,
        }}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <SemiBoldText style={{}}>{item.name}</SemiBoldText>
            <SmallText style={{ color: "#666666", fontSize: 13 }}>
              {item.description}
            </SmallText>
            <MediumText style={{ marginTop: 8 }}>
              ₦{item.price.toFixed(2)}
            </MediumText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <SmallText
              style={{
                color: item.available ? "green" : "red",
                fontSize: 13,
              }}
            >
              {item.available ? "Available" : "Unavailable"}
            </SmallText>
            <Switch
              value={item.available}
              onValueChange={handleToggle}
              disabled={isUpdating}
              trackColor={{ false: "#D1D1D1", true: `${COLORS.secondary}50` }}
              thumbColor={item.available ? COLORS.secondary : "#F4F4F4"}
            />
            <TouchableOpacity onPress={() => onEdit(item._id)}>
              <SmallText
                style={{
                  color: COLORS.secondary,
                  textDecorationLine: "underline",
                  fontSize: 13,
                }}
              >
                Edit
              </SmallText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function MenuScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const user = useAuthStore((state) => state.userInfo);
  const token = useAuthStore((state) => state.token);
  const userInfo = JSON.parse(user);

  const getMenu = () => {
    setLoading(true);

    axios
      .get(`${BASE_URL}/product/get/${userInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Menu:", response.data.data);
        setMenu(response.data.data || []);
      })
      .catch(() => ErrorToast("Failed to fetch menu"))
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      getMenu();
    }, [])
  );

  const handleToggleAvailability = async (id: string, newValue: boolean) => {
    setUpdatingId(id);

    axios
      .put(
        `${BASE_URL}/product/editAvailability`,
        { menuId: id, available: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMenu((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, available: newValue } : item
          )
        );
        SuccessToast("Menu availability updated");
      })
      .catch(() => ErrorToast("Failed to update availability"))
      .finally(() => setUpdatingId(null));
  };

  const handleEdit = (id: string) => {
    const menuItem = menu.find((item) => item._id === id);
    if (menuItem) {
      router.push({
        pathname: "/AddMenu",
        params: {
          id: menuItem._id,
          menuData: JSON.stringify(menuItem),
        },
      });
    } else {
      ErrorToast("Menu item not found");
    }
  };

  const handleAddMenu = () => {
    router.push({
      pathname: "/AddMenu",
      params: { id: "new" },
    });
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
      <Spinner visible={loading} overlayColor="rgba(0, 0, 0, 0.7)" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#F4F4F4",
          paddingBottom: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <SemiBoldText style={{ fontSize: 16 }}>Menu</SemiBoldText>
          <SmallText style={{ color: "#666666", fontSize: 13 }}>
            Customize your menu
          </SmallText>
        </View>

        <TouchableOpacity onPress={() => router.push("/order")}>
          <Bell size={20} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {/* Menu List Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 25,
          paddingBottom: 8,
        }}
      >
        <MediumText style={{}}>Lists of menu</MediumText>
        <TouchableOpacity onPress={handleAddMenu}>
          <SmallText
            style={{ color: COLORS.secondary, textDecorationLine: "underline" }}
          >
            Add menu
          </SmallText>
        </TouchableOpacity>
      </View>

      {/* Menu List or Empty State */}
      {!loading && menu.length === 0 ? (
        <NoDataView
          message="No menu yet"
          icon={<BookOpen size={48} color="#CCCCCC" />}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8 }}
        >
          {menu.map((item) => (
            <MenuItemComponent
              key={item._id}
              item={item}
              onToggleAvailability={handleToggleAvailability}
              onEdit={handleEdit}
              isUpdating={updatingId === item._id}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
