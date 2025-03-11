import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { MediumText, SemiBoldText } from "../components/common/AppText";
import { Heart, Star, Truck } from "lucide-react-native";
import COLORS from "../constants/colors";
import { useRouter } from "expo-router";
import { Restaurant } from "../hooks/data/restaurants";
import { Dimensions } from "react-native";

const { width: ScreenWidth } = Dimensions.get("window");

type RestaurantCardProps = {
  restaurant: Restaurant;
  horizontal?: boolean;
  onPress: (id: string) => void;
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  horizontal = true,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to restaurant details
    // router.push(`/restaurant/${restaurant.id}`);
    // In a real app, you would use your cart store to clear the cart
    // Example: clearCart();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        marginRight: 20,
        width: horizontal ? ScreenWidth - 80 : "100%",
        height: 200,
        marginBottom: horizontal ? 0 : 20,
      }}
    >
      <Image
        style={{
          width: horizontal ? ScreenWidth - 80 : "100%",
          height: 140,
          borderRadius: 8,
          marginBottom: 10,
        }}
        source={{ uri: restaurant.image }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <SemiBoldText style={{ fontSize: 12 }}>{restaurant.name}</SemiBoldText>
        <Heart size={20} color={COLORS.black} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Star
            size={13}
            color={COLORS.primary}
            fill={COLORS.primary}
            style={{ marginRight: 5 }}
          />
          <MediumText style={{ fontSize: 14 }}>
            {restaurant.rating.toFixed(1)} ({restaurant.totalRatings})
          </MediumText>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Truck size={15} color={COLORS.grey} style={{ marginRight: 5 }} />
          <MediumText style={{ fontSize: 12, marginRight: 5 }}>
            ₦{restaurant.deliveryFee}
          </MediumText>
          <MediumText style={{ fontSize: 12, marginRight: 5 }}>|</MediumText>
          <MediumText
            style={{
              fontSize: 12,
              color: restaurant.isOpen ? "green" : "red",
            }}
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </MediumText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
