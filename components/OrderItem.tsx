import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import {
  MediumText,
  SmallText,
  SemiBoldText,
} from "@/components/common/AppText";
import COLORS from "@/constants/colors";

export interface OrderItemProps {
  foodName: string;
  description: string;
  price: any;
  image: string;
  timestamp: any;
  onViewOrder?: () => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  foodName,
  description,
  price,
  image,
  timestamp,
  onViewOrder,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 12,
        marginBottom: 16,
        backgroundColor: COLORS.grey,
        borderRadius: 12,
      }}
    >
      <Image
        source={{ uri: image }}
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
          <View>
            <SemiBoldText style={{}}>{foodName}</SemiBoldText>
            <SmallText
              style={{ color: "#666666", marginTop: -2, fontSize: 12 }}
            >
              {description}
            </SmallText>
            <MediumText style={{ marginTop: 8, fontSize: 13 }}>
              ₦{price}
            </MediumText>
          </View>
          <SmallText style={{ color: "#666666", fontSize: 12 }}>
            {timestamp}
          </SmallText>
        </View>
        <TouchableOpacity
          onPress={onViewOrder}
          style={{ alignSelf: "flex-end", marginTop: -10 }}
        >
          <SmallText style={{ color: COLORS.secondary }}>View order</SmallText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderItem;
