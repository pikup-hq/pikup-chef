import React, { useEffect, useRef } from "react";
import { Modal, View, TouchableOpacity, Vibration } from "react-native";
import { router } from "expo-router";
import { Audio } from "expo-av";
import { BellRing } from "lucide-react-native";
import { MediumText, SemiBoldText, SmallText } from "@/components/common/AppText";
import useNotificationStore from "@/store/notificationStore";
import COLORS from "@/constants/colors";

// Stop ringing on its own if nobody responds, so it never rings forever.
const MAX_RING_MS = 45 * 1000;

const NewOrderAlert: React.FC = () => {
  const alert = useNotificationStore((s) => s.orderAlert);
  const dismiss = useNotificationStore((s) => s.dismissOrderAlert);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (!alert) return;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const ring = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          staysActiveInBackground: false,
        });
        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/sounds/new_order.wav"),
          { isLooping: true, shouldPlay: true, volume: 1.0 }
        );
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        Vibration.vibrate([0, 400, 250, 400], true);
        timeout = setTimeout(stop, MAX_RING_MS);
      } catch (e) {
        console.log("Could not play order alert", e);
      }
    };

    const stop = async () => {
      Vibration.cancel();
      const sound = soundRef.current;
      soundRef.current = null;
      if (sound) {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch {}
      }
    };

    ring();
    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
      stop();
    };
  }, [alert]);

  if (!alert) return null;

  const viewOrder = () => {
    const id = alert.orderObjectId || alert.orderId;
    dismiss();
    router.push({ pathname: "/orderDetail", params: { id } });
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: COLORS.lightOrange,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <BellRing size={32} color={COLORS.secondary} />
          </View>
          <SemiBoldText style={{ fontSize: 18, marginBottom: 6 }}>{alert.title}</SemiBoldText>
          <MediumText style={{ textAlign: "center", color: "#555555", marginBottom: 24 }}>
            {alert.message}
          </MediumText>
          <TouchableOpacity
            onPress={viewOrder}
            style={{
              backgroundColor: COLORS.secondary,
              borderRadius: 10,
              paddingVertical: 14,
              alignSelf: "stretch",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <SemiBoldText style={{ color: "#FFFFFF" }}>View order</SemiBoldText>
          </TouchableOpacity>
          <TouchableOpacity onPress={dismiss} style={{ paddingVertical: 10 }}>
            <SmallText style={{ color: "#666666" }}>Dismiss</SmallText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NewOrderAlert;
