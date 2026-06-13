import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { supabase } from "../lib/supabase";

export default function TestSupabase() {
  const [message, setMessage] = useState("Testing...");

  useEffect(() => {
    async function run() {
      const { data, error } = await supabase
        .from("emergency_profiles")
        .select("*")
        .limit(1);

      if (error) {
        console.log(error);
        setMessage(error.message);
      } else {
        console.log(data);
        setMessage(`Success! Found ${data.length} record(s)`);
      }
    }

    run();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>{message}</Text>
    </View>
  );
}