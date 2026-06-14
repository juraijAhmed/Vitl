import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "vitl-emergency";
const NOTIFICATION_ID = "vitl-emergency-id";

export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    // Delete old channel first to force recreation with new settings
    await Notifications.deleteNotificationChannelAsync(CHANNEL_ID);

    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Emergency Medical ID",
      importance: Notifications.AndroidImportance.MAX,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      enableVibrate: false,
      showBadge: false,
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function postEmergencyNotification(
  profile: {
    fullName: string;
    bloodType: string;
    allergies: string[];
    emergencyContacts: { name: string; phone: string }[];
  },
  qrBase64?: string,
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Vitl Test",
      body: "tap me",
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
      repeats: false,
    },
  });
}

export async function dismissEmergencyNotification() {
  await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
}
