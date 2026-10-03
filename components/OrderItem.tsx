import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { MediumText, SmallText, SemiBoldText } from "@/components/common/AppText";
import COLORS from "@/constants/colors";
import type { Order } from "@/types";
import { STATUS_COLORS, STATUS_LABELS, formatDate, naira } from "@/utilities/format";

export interface OrderItemProps {
  order: Order;
  onViewOrder?: () => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onViewOrder }) => {
  const first = order.items[0];
  const product = first?.product;
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const otherLines = order.items.length - 1;
  const extrasCount = order.items.reduce((sum, item) => sum + (item.extras?.length || 0), 0);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onViewOrder}
      style={{
        flexDirection: "row",
        padding: 12,
        marginBottom: 16,
        backgroundColor: `${COLORS.grey}80`,
        borderRadius: 12,
      }}
    >
      <Image
        source={product?.image ? { uri: product.image } : undefined}
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          marginRight: 12,
          backgroundColor: COLORS.grey,
        }}
      />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <SmallText style={{ color: "#666666", fontSize: 12 }}>#{order.orderId}</SmallText>
          <View
            style={{
              backgroundColor: `${STATUS_COLORS[order.status]}20`,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 10,
            }}
          >
            <SmallText style={{ color: STATUS_COLORS[order.status], fontSize: 11 }}>
              {STATUS_LABELS[order.status] || order.status}
            </SmallText>
          </View>
        </View>
        <SemiBoldText numberOfLines={1} style={{ marginTop: 2 }}>
          {product?.name || "Item unavailable"}
          {otherLines > 0 ? ` +${otherLines} more` : ""}
        </SemiBoldText>
        <SmallText style={{ color: "#666666", fontSize: 12 }} numberOfLines={1}>
          {totalItems} item{totalItems === 1 ? "" : "s"}
          {extrasCount ? ` • ${extrasCount} extra${extrasCount === 1 ? "" : "s"}` : ""}
          {order.user?.name ? ` • ${order.user.name}` : ""}
        </SmallText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <MediumText style={{ fontSize: 13 }}>{naira(order.totalAmount)}</MediumText>
          <SmallText style={{ color: "#666666", fontSize: 11 }}>{formatDate(order.createdAt)}</SmallText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;
