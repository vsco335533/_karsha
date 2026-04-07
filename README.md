# Karsha Native: Project Anatomy 🚀📱

This is the "under the hood" guide for the Karsha Mobile app. Here is exactly what every file does and how the whole thing fits together in our new modular architecture.

---

## 🏗️ Project Architecture

### 📂 `App.js` (The Navigation Hub)
- **What it does**: Manages the **Global State** and routing for the entire app.
- **Key Logic**: Tracks the current screen using a numeric `idx`.
- **Persistence**: Saves Farmer IDs, language preferences, and dark mode settings using `AsyncStorage`.

### 📂 `constants.js` (Global Config)
- **What it does**: Centralized configuration file.
- **Contents**: Holds the `BACKEND_URL`, lists of **Crops** (Rice, Cotton, etc.), soil types, and irrigation methods with their localized names and icons.

### 📂 `Translations.js` (Localization)
- **What it does**: The dictionary for the entire app.
- **Support**: 100% support for **English**, **Telugu**, and **Hindi**. Every button and label in the app pulls from this file using the `lang` state.

### 📂 `theme.js` (Design System)
- **What it does**: Standardizes the look and feel.
- **Key Logic**: Defines consistent colors (Karsha Green, Earth Browns), typography, and spacing tokens used throughout the app.

---

## 📱 Feature Modules (screens/)

### 📂 `screens/onboarding/`
Handles the initial user journey and field registration.
- `Welcome.js`: Language selection and login/register entry points.
- `Profile.js`: Farmer details collection (Name, Village, etc.).
- `CropSoil.js`: Collecting field-specific data (Crop type, Sowing date).
- `BoundaryMap.js`: Full-screen map for drawing field polygons.
- `Confirmation.js`: Final review of field data before saving.
- `Success.js`: Completion screen before entering the dashboard.

### 📂 `screens/dashboard/`
The main functional hub for a logged-in farmer.
- `Dashboard.js`: Shows the primary field list, weather updates, and global health stats.
- `FieldDetails.js`: Deep dive into specific field metrics (NDVI, Moisture).
- `AnalysisMap.js`: Satellite overlay map showing localized stress zones.

### 📂 `screens/diagnosis/`
The advanced "Satellite to Solution" workflow.
- `AnalysisLoading.js`: Triggers the backend AI analysis.
- `AnalysisResult.js`: Shows the post-analysis map with identified stress points.
- `AI.js`: Explains the scientific analysis and provides direct navigation to stress zones.
- `Diagnosis.js`: Breaks down exactly what the satellite found (Pests, Water stress).
- `Remedy.js`: Provides actionable steps for the farmer to take.
- `FieldNavigation.js`: Precise compass-based guidance to the on-ground stress point.
- `ManualChecklist.js`: Guided on-ground verification steps.
- `PhotoUpload.js`: Capture evidence of field health.
- `AlertHistory.js`: History of all previous stress alerts found by the AI.

---

## 🎨 Shared Components

### 📂 `components/Shared.js`
Reusable UI blocks like `Hdr` (Header), `Btn` (Button), `Card`, and `FieldHeatmap`.

### 📂 `components/LocalizationContext.js`
A React Context provider that makes translation functions available globally.

---

## 🏃‍♂️ How to Run Locally (Development)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the Server**:
    ```bash
    npx expo start
    ```
3.  **Open on Phone**: Scan the QR code using the **Expo Go** app.

---

## 🏗️ How to Build the APK (Production)

When you are ready to give the app to farmers, you need to create a standalone APK file. We use **EAS (Expo Application Services)** for this.

### 1. Prerequisites
-   You need an **Expo Account** (Sign up at expo.dev).
-   Install the EAS tool on your laptop:
    ```bash
    npm install -g eas-cli
    ```
-   Log in to your account:
    ```bash
    eas login
    ```

### 2. Configure the Build (One-time)
If it's a new project, run this to link it to your account:
```bash
eas build:configure
```
*(Choose **"Android"** or **"All"** when asked.)*

### 3. Start the Build
To create the APK, run the following command:
```bash
eas build -p android --profile preview
```
-   This will upload your code to Expo's servers and build it in the cloud. ☁️
-   It usually takes **10–15 minutes**.
-   Once it finishes, it will give you a **Download Link**.

### 4. Check Build Status
If you closed your terminal and want to see if the build is finished:
```bash
eas build:list --limit 1
```

---
*Every line of code here is built to be fast, stable, and easy for a farmer to use!* 🚀
