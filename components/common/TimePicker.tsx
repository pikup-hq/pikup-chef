import React from "react";
import { View, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MediumText } from "./AppText";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";

const HOURS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6; // Start from 6 AM
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
});

interface TimePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  selectedTime?: string;
  title: string;
  availableTimes?: string[];
}

export const TimePicker = ({
  visible,
  onClose,
  onSelect,
  selectedTime,
  title,
  availableTimes = HOURS,
}: TimePickerProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            maxHeight: "50%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MediumText style={{ fontSize: 16, fontWeight: "600" }}>
              {title}
            </MediumText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {availableTimes.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => {
                  onSelect(time);
                  onClose();
                }}
                style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MediumText style={{ flex: 1 }}>{time}</MediumText>
                {selectedTime === time && (
                  <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
