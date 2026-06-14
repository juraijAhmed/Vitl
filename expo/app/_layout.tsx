import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProfileProvider } from "../context/ProfileContext";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const ONBOARDING_KEY = "vitl_onboarding_complete";

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="review"
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="emergency-card"
        options={{ presentation: "fullScreenModal", animation: "fade" }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!done) {
        router.replace("/onboarding" as any);
      }
      try {
        await SplashScreen.hideAsync();
      } catch (_) {}
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen === "emergency-card") {
          router.push("/emergency-card");
        }
      },
    );
    return () => subscription.remove();
  }, []);

  // ← removed `if (!ready) return null` — Stack must be mounted for router.replace to work
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ProfileProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="review"
                options={{ presentation: "card", animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="emergency-card"
                options={{ presentation: "fullScreenModal", animation: "fade" }}
              />
              <Stack.Screen
                name="edit-profile"
                options={{ presentation: "card", animation: "slide_from_right" }}
              />
            </Stack>
          </GestureHandlerRootView>
        </ProfileProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}