# Vitl

Vitl is a medical identity app built with Expo and React Native. It provides a patient profile card, emergency contacts management, medical details, and an SOS workflow for sharing location with a primary emergency contact.

## Key Features

- Hero medical ID card with QR placeholder, blood type, age, and preferred language.
- Allergy and medical conditions summary.
- Emergency contact management with primary/secondary contact support.
- Edit profile workflow for personal info, allergies, medications, and conditions.
- Recovery code card to restore a profile on a new device.
- Local persistence using SQLite (`expo-sqlite`).
- SOS helper that requests location permission and opens the device messaging app with a prepared alert.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- `expo-sqlite` for local data persistence
- `@tanstack/react-query` for client state management
- `lucide-react-native` for icons
- `react-native-safe-area-context` and gesture handler for native UI support

## Project Structure

- `expo/app/` - main app routes and screen components
  - `app/(tabs)/index.tsx` - home/vitals tab screen
  - `app/(tabs)/profile.tsx` - profile/settings screen
  - `app/edit-profile.tsx` - edit profile screen
  - `app/emergency-contacts.tsx` - emergency contacts management
  - `app/review.tsx` - review screen (app flow)
  - `app/emergency-card.tsx` - full-screen emergency card
- `expo/context/ProfileContext.tsx` - profile context provider and helper hooks
- `expo/database/db.tsx` - SQLite database initialization and profile persistence
- `expo/models/Profile.ts` - TypeScript profile and emergency contact models
- `expo/constants/` - app theme colors and font definitions

## Setup

From the project root:

```bash
cd expo
npm install
```

Then start the app:

```bash
npm run start
```

Available scripts:

- `npm run start` - start Expo with router and tunnel support
- `npm run start-web` - start Expo web with tunnel support
- `npm run start-web-dev` - start web with debug logging for Expo
- `npm run lint` - run ESLint

## App Flow

- `Vitals` tab shows the medical ID card, allergy and condition details, emergency contacts, and an SOS action.
- `Profile` tab displays user settings, recovery code, version info, and navigation to edit profile.
- `Edit profile` allows updating name, allergies, medications, conditions, emergency contacts, and language preference.
- `Emergency contacts` screen lets users add, edit, and remove contact entries.

## Data Persistence

Vitl stores the profile in a local SQLite database via `expo-sqlite`.

- `initDB()` creates the profile table if it does not exist.
- `saveProfile(profile)` persists updates automatically.
- `loadProfile()` loads the profile when the app initializes.

## Notes

- The app uses an `expo-router` layout with a stack navigator and tab screens.
- The app is currently configured with the scheme `rork-app` and slug `unpr3aerm2to7vy9nrclk`.
- Default demo profile data is provided in `ProfileContext.tsx` and is used when no saved SQLite profile exists.

## License

This repository does not specify a license. Add one if you want to publish or share the project.
