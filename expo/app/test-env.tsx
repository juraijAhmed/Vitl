import { View, Text } from "react-native";

export default function TestEnv() {
  return (
    <View style={{ padding: 40 }}>
      <Text>
        {process.env.EXPO_PUBLIC_SUPABASE_URL || "NO URL FOUND"}
      </Text>
    </View>
  );
}