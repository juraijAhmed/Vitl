import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'vitl-emergency';
const NOTIFICATION_ID = 'vitl-emergency-id';

export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Emergency Medical ID',
      importance: Notifications.AndroidImportance.HIGH,
      lockscreenVisibility:
        Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      enableVibrate: false,
      showBadge: false,
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function postEmergencyNotification(profile: {
  fullName: string;
  bloodType: string;
  allergies: string[];
  emergencyContacts: { name: string; phone: string }[];
}) {
  await Notifications.dismissNotificationAsync(NOTIFICATION_ID);

  const allergies = profile.allergies?.length
    ? `⚠ Allergies: ${profile.allergies.join(', ')}`
    : 'No known allergies';

  const contact = profile.emergencyContacts?.[0]
    ? `Emergency: ${profile.emergencyContacts[0].name} · ${profile.emergencyContacts[0].phone}`
    : '';

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: `Vitl — ${profile.fullName}`,
      body: `${profile.bloodType} · ${allergies}\n${contact}`,
      sticky: true,
      autoDismiss: false,
      data: { screen: 'emergency-card' },
    },
    trigger: null,
  });
}

export async function dismissEmergencyNotification() {
  await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
}