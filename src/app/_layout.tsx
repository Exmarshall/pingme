
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from "../providers/AuthProvider";
import { PermissionsAndroid, Platform } from "react-native";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    const run = async () => {
      if (Platform.OS === "android") {
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);
        } catch (err) {
          console.warn("Permission request error:", err);
        }
      }
    };

    run();
  }, []);
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
         <Slot />
      </AuthProvider>
     

      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}
