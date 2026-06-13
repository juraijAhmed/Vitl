import { Tabs, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Platform, View, Text } from "react-native";
import { House, Clock, Heart, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/fonts";

export default function TabLayout() {
  const pathname = usePathname();

  const isActive = (route: string): boolean => {
    if (route === "/" || route === "index") {
      return pathname === "/" || pathname === "/index";
    }
    return pathname?.startsWith(`/${route}`) ?? false;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.brandGreen,
        tabBarInactiveTintColor: Colors.mediumGray,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
  
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 88 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 11,
    marginTop: 2,
  },
});
