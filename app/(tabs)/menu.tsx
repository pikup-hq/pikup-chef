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
import { menuData, MenuItem } from "@/hooks/data/menu";
import COLORS from "../../constants/colors";
import { SuccessToast } from "@/components/common/Toasts";

interface MenuItemProps {
  item: MenuItem;
  onToggleAvailability: (id: string, newValue: boolean) => Promise<void>;
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
      await onToggleAvailability(item.id, !item.isAvailable);
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
                color: item.isAvailable ? "green" : "red",
                fontSize: 13,
              }}
            >
              {item.isAvailable ? "Available" : "Unavailable"}
            </SmallText>
            <Switch
              value={item.isAvailable}
              onValueChange={handleToggle}
              disabled={isUpdating}
              trackColor={{ false: "#D1D1D1", true: `${COLORS.secondary}50` }}
              thumbColor={item.isAvailable ? COLORS.secondary : "#F4F4F4"}
            />
            <TouchableOpacity onPress={() => onEdit(item.id)}>
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

  // Simulate API fetch
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMenu(menuData);
      } catch (error) {
        Alert.alert("Error", "Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleToggleAvailability = async (id: string, newValue: boolean) => {
    try {
      setUpdatingId(id);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMenu((prevMenu) =>
        prevMenu.map((item) =>
          item.id === id ? { ...item, isAvailable: newValue } : item
        )
      );
    } finally {
      SuccessToast("Meal Availability Updated");
      setUpdatingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push({
      pathname: "/AddMenu",
      params: { id: `${id}` },
    });
  };

  const handleAddMenu = () => {
    router.push({
      pathname: "/AddMenu",
      params: { id: "new" },
    });
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
              key={item.id}
              item={item}
              onToggleAvailability={handleToggleAvailability}
              onEdit={handleEdit}
              isUpdating={updatingId === item.id}
            />
          ))}
        </ScrollView>
      )}
    </AppSafeAreaView>
  );
}
