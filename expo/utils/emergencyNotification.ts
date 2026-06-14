import * as Notifications from "expo-notifications";
import { Platform, Linking } from "react-native";

const CHANNEL_ID = "vitl-emergency";
const NOTIFICATION_ID = "vitl-emergency-id";

export function registerNotificationTapHandler() {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const url = response.notification.request.content.data?.url as string | undefined;
    if (url) Linking.openURL(url);
  });
}

export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
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
    emergencyId?: string | null;
  },
  qrBase64?: string,
) {
  await Notifications.cancelScheduledNotificationAsync(`${NOTIFICATION_ID}-repeat`).catch(() => {});

  const emergencyUrl = profile.emergencyId
    ? `https://vitl-web.vercel.app/e/${profile.emergencyId}`
    : null;

  const content: Notifications.NotificationContentInput = {
    title: "🆔 Scan to get vital info",
    body: emergencyUrl ?? "Emergency profile not yet synced.",
    data: emergencyUrl ? { url: emergencyUrl } : {},
    sound: undefined,
  };

  // Post immediately
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content,
    trigger: null,
  });

  // Re-post every 30 minutes so it reappears if swiped away
  await Notifications.scheduleNotificationAsync({
    identifier: `${NOTIFICATION_ID}-repeat`,
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 30 * 60,
      repeats: true,
    },
  });
}

export async function dismissEmergencyNotification() {
  await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
  await Notifications.cancelScheduledNotificationAsync(`${NOTIFICATION_ID}-repeat`).catch(() => {});
}