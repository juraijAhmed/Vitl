import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { loadProfile } from "../database/db";
import { postEmergencyNotification } from "../app/emergencyNotification";

const TASK_NAME = "vitl-repost-notification";

// Define the task — re-posts the notification if dismissed
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const profile = await loadProfile();
    if (profile) {
      await postEmergencyNotification(profile);
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask() {
  const status = await BackgroundFetch.getStatusAsync();
  if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15 * 60, // 15 minutes — iOS minimum
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
}
