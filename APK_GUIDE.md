# 📱 Karsha APK: The Complete Guide for Farmers 🌾

Welcome to the **Karsha Mobile** application! This guide will walk you through exactly how to get the app on your phone and start monitoring your fields like a pro.

---

### 1. 📥 Getting the APK
- You will receive a link from the build system (e.g., `expo.dev/artifacts/eas/...apk`).
- Tap that link on your phone to download the file.
- It will be named something like `karsha-native-xxxx.apk`.

### 1.5 📱 Device Compatibility
- **Android Phones**: ✅ **YES!** This is exactly what the APK is for.
- **Android Tablets**: ✅ **YES!** It will work just like a phone, but with a bigger screen.
- **iPhones (iOS)**: ❌ **NO.** An APK file cannot be installed on an iPhone. To use Karsha on an iPhone, you need a different version called an **IPA** file (requires a separate build process).
- **iPads**: ❌ **NO.** Just like iPhones, an APK will not work on iPads.

### 2. 🛠️ Installing it Safely
Android phones sometimes block apps that aren't from the Play Store. Here’s how to fix that:
- Open your **Downloads** folder and tap the APK file.
- If it says "Install blocked," go to your **Settings**.
- Look for **"Install Unknown Apps"** and make sure it is turned **ON** for your browser or file manager.
- Once that's done, tap **Install** again. It should take about 10 seconds.

### 3. 🌐 Connecting to the Brain (The Backend)
For the app to see your crops, it needs to talk to the laptop running the backend. 

**CRITICAL STEP (Do this once!):**
Before you open the app for the first time, open your phone's **Chrome Browser** and type this URL:
👉 `https://karsha-api-v1.loca.lt`
- You will see a screen with a big button that says **"Click to Continue"**.
- **Tap that button!** This "unlocks" the tunnel so the app can talk to the brain.

### 4. 🚜 Using the App
1. **Language**: Choose your favorite language (**Telugu**, **Hindi**, or **English**).
2. **Profile**: Enter your name and village.
3. **Add Field**: Draw your field on the map. Make sure you use the big **bold arrows** to navigate!
4. **Analysis**: Tap "Analyze" and wait for the satellite to do its magic. It will show you exactly where your crops are thirsty or stressed.
5. **Satellite to Solution**: Follow the diagnostic steps to navigate to stress zones, verify issues, and apply remedies.

### ⚠️ Pro-Tips for Success:
- **Keep the Laptop Running**: The app won't work if the laptop (the brain) is closed or the terminal is stopped.
- **Uninstall Old Versions**: If you have an old version of Karsha on your phone, **delete it first** before installing the new one.
- **Logout**: If you want to start fresh or let someone else use your phone, go to the **Profile** screen (Settings icon) and tap **Log Out**. It will safely clear all your data.


EAS Build Commands:

Install/Update EAS CLI: npm install -g eas-cli
Login to Expo (if not already): eas login
Generate Android APK (Preview): eas build -p android --profile preview
Monitor Status: eas build:list


---
*Happy Farming! If you see a connection error, just remember to click that "Click to Continue" button in your browser one more time.* 🚀🌵
