import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import {
  useFonts,
  NotoSans_400Regular,
  NotoSans_700Bold
} from '@expo-google-fonts/noto-sans';
import {
  NotoSansTelugu_400Regular,
  NotoSansTelugu_700Bold
} from '@expo-google-fonts/noto-sans-telugu';

import { COLORS, GET_THEME } from './theme';
import OnboardingScreens, { S3_Crop, S4_Method, S4_Boundary, S5_Confirm, S5b_Success } from './screens/onboarding';
import { S6_Home } from './screens/dashboard/Dashboard';
import { S7_FieldDetail } from './screens/dashboard/FieldDetails';
import { S9_AnalysisMap } from './screens/dashboard/AnalysisMap';
import { BACKEND_URL, setBackendUrl } from './constants';
import {
  S10_Analysis, S10c_AnalysisResult, S11_AI, S11_Diagnosis, S12_Remedy, S13_Progress, S14_Profile,
  S9b_FieldNavigation, S10b_ManualChecklist, S11b_PhotoUpload,
  S8_Alerts, S18_AlertHistory, S13b_Done
} from './screens/diagnosis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { BackHandler, Alert } from 'react-native';

import { LocalizationProvider, useLocalization } from './components/LocalizationContext';
import { BottomNav } from './components/Shared';

function MainApp() {
  const { lang, setLang, t } = useLocalization();
  const [fontsLoaded] = useFonts({
    NotoSans_400Regular,
    NotoSans_700Bold,
    NotoSansTelugu_400Regular,
    NotoSansTelugu_700Bold,
  });

  const [idx, setIdx] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [farmerProfile, setFarmerProfile] = useState({ name: '', phone: '', village: '', mandal: '', district: '' });
  const [farmDetails, setFarmDetails] = useState({
    crop_type: null,
    area: '2.5',
    date: new Date().toISOString().split('T')[0],
    soil_type: '',
    irrigation: 'borewell'
  });
  const [farmerId, setFarmerId] = useState(null);
  const [selField, setSelField] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const theme = GET_THEME(isDarkMode);

  // System Back Button Handler
  useEffect(() => {
    const onBackPress = () => {
      if (idx === 0 || idx === 7) return false;
      setIdx(prev => {
        if (prev === 22 || (prev >= 18 && prev <= 21)) return 7;
        if (prev === 11) return 10;
        if (prev === 12) return 11;
        if (prev === 13) return 12;
        if (prev === 14) return 13;
        if (prev === 23) return 14;
        if (prev === 15) return 23;
        if (prev === 16) return 15;
        if (prev === 17) return 16;
        if (prev === 8 || prev === 9) return 7;
        return Math.max(0, prev - 1);
      });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [idx]);

  // Load state on mount
  useEffect(() => {
    async function loadState() {
      try {
        const savedIdx = await AsyncStorage.getItem('karsha_idx');
        const savedProfile = await SecureStore.getItemAsync('karsha_profile');
        const savedFarm = await SecureStore.getItemAsync('karsha_farm');
        const savedId = await SecureStore.getItemAsync('karsha_farmer_id');
        const savedLang = await AsyncStorage.getItem('karsha_lang');
        const savedDark = await AsyncStorage.getItem('karsha_dark');
        const savedApi = await AsyncStorage.getItem('karsha_api');
        if (savedApi) setBackendUrl(savedApi);
        if (savedLang) setLang(savedLang);
        if (savedDark) setIsDarkMode(savedDark === 'true');
        if (savedFarm) setFarmDetails(JSON.parse(savedFarm));
        let effectiveId = (savedId && savedId !== 'undefined') ? savedId : null;
        if (savedProfile) {
          try {
            const prof = JSON.parse(savedProfile);
            setFarmerProfile(prof);
            if (!effectiveId && prof && prof.id && prof.id !== 'undefined') effectiveId = prof.id.toString();
          } catch (pe) { }
        }
        if (effectiveId) {
          setFarmerId(effectiveId);
          if (savedIdx) setIdx(parseInt(savedIdx)); else setIdx(7);
        } else if (savedIdx) {
          setIdx(parseInt(savedIdx));
        }
      } catch (e) { } finally { setIsReady(true); }
    }
    loadState();
  }, []);

  // Save state on changes
  useEffect(() => {
    if (!isReady) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem('karsha_idx', idx.toString());
        await SecureStore.setItemAsync('karsha_profile', JSON.stringify(farmerProfile));
        await SecureStore.setItemAsync('karsha_farm', JSON.stringify(farmDetails));
        await AsyncStorage.setItem('karsha_lang', lang);
        await AsyncStorage.setItem('karsha_dark', isDarkMode ? 'true' : 'false');
        if (farmerId && farmerId !== 'undefined') await SecureStore.setItemAsync('karsha_farmer_id', farmerId.toString());
        else if (farmerId === null) await SecureStore.deleteItemAsync('karsha_farmer_id');
      } catch (e) { }
    };
    save();
  }, [idx, farmerProfile, farmDetails, farmerId, lang, isDarkMode, isReady]);

  if ((!fontsLoaded || !isReady) && Platform.OS !== 'web') {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const next = () => setIdx(i => Math.min(25, i + 1));
  const back = () => setIdx(i => Math.max(0, i - 1));
  const goTo = (i) => setIdx(i);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setIdx(0); setLang('en'); setIsDarkMode(false);
      setFarmerProfile({ name: '', phone: '', village: '', mandal: '', district: '' });
      setFarmDetails({ crop: null, area: '2.5', date: new Date().toISOString().split('T')[0], soil: '', irrigation: 'borewell' });
      setFarmerId(null); setSelField(null); setAnalysisData(null);
    } catch (e) { setIdx(0); }
  };

  const handleTabPress = (tab) => {
    if (tab === 'AI') setIdx(25);
    if (tab === 'Report') setIdx(15);
    if (tab === 'Remedy') setIdx(16);
    if (tab === 'Prog') setIdx(17);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={styles.content}>
        {idx >= 0 && idx <= 6 && (
          <OnboardingScreens
            idx={idx} next={next} back={back} goTo={goTo} lang={lang} setLang={setLang}
            isDarkMode={isDarkMode} theme={theme} farmerProfile={farmerProfile}
            setFarmerProfile={setFarmerProfile} farmDetails={farmDetails}
            setFarmDetails={setFarmDetails} setFarmerId={setFarmerId} farmerId={farmerId}
          />
        )}
        {idx === 7 && (
          <S6_Home
            idx={idx} lang={lang} isDarkMode={isDarkMode} theme={theme}
            farmerId={farmerId || farmerProfile?.id} farmerProfile={farmerProfile}
            goTo={goTo} onNext={(field, targetIdx) => {
              if (field) { setSelField(field); setAnalysisData(null); setIdx(targetIdx || 10); }
              // if (field) { setSelField(field); setAnalysisData(null); setIdx(targetIdx || 13); }

              else { setFarmDetails(prev => ({ ...prev, coordinates: [], area: '0' })); setIdx(2); }
            }}
          />
        )}
        {idx === 8 && (
          <S7_FieldDetail
            lang={lang} isDarkMode={isDarkMode} theme={theme}
            field={selField} analysisData={analysisData}
            onBack={() => setIdx(7)} onAnalyze={() => setIdx(10)}
          />
        )}
        {idx === 9 && (
          <S8_Alerts
            lang={lang} isDarkMode={isDarkMode} theme={theme}
            field={selField} analysisData={analysisData}
            onBack={() => setIdx(7)} onNext={() => setIdx(12)}
          />
        )}
        {idx === 10 && (
          <S10_Analysis
            lang={lang} theme={theme} field={selField}
            setAnalysisData={setAnalysisData} onNext={() => setIdx(24)} onBack={() => setIdx(7)}
          />
        )}
        {idx === 24 && (
          <S10c_AnalysisResult
            lang={lang} theme={theme} field={selField}
            analysisData={analysisData} onNext={() => setIdx(25)} onBack={() => setIdx(10)}
          />
        )}
        {idx === 25 && (
          <S11_AI
            lang={lang} theme={theme} field={selField}
            analysisData={analysisData} onNext={() => setIdx(15)} onBack={() => setIdx(24)}
            onTabPress={(tab) => handleTabPress(tab)}
          />
        )}
        {idx === 11 && (
          <S9_AnalysisMap
            lang={lang} theme={theme} field={selField}
            analysisData={analysisData} onBack={() => selField ? setIdx(8) : setIdx(7)}
            onDiagnosis={() => setIdx(12)}
          />
        )}
        {idx === 12 && (
          <S9b_FieldNavigation
            lang={lang} theme={theme} field={selField}
            analysisData={analysisData} onNext={() => setIdx(13)} onBack={() => setIdx(11)}
          />
        )}
        {idx === 13 && (
          <S10b_ManualChecklist
            lang={lang} theme={theme} field={selField}
            onNext={() => setIdx(14)} onBack={() => setIdx(7)}
          />
        )}
        {idx === 14 && (
          <S11b_PhotoUpload
            lang={lang} theme={theme} field={selField}
            onNext={() => setIdx(23)} onBack={() => setIdx(13)}
          />
        )}
        {idx === 23 && (
          <S13b_Done
            lang={lang} theme={theme} onNext={() => setIdx(10)} onBack={() => setIdx(14)}
          />
        )}
        {idx === 15 && (
          <S11_Diagnosis
            lang={lang} theme={theme} analysisData={analysisData}
            onNext={() => setIdx(16)} onBack={() => setIdx(25)}
            onTabPress={(tab) => handleTabPress(tab)}
          />
        )}
        {idx === 16 && (
          <S12_Remedy
            lang={lang} theme={theme} analysisData={analysisData}
            onNext={() => setIdx(17)} onBack={() => setIdx(15)}
            onTabPress={(tab) => handleTabPress(tab)}
          />
        )}
        {idx === 17 && (
          <S13_Progress
            lang={lang} theme={theme} onBack={() => setIdx(16)}
            onHome={() => setIdx(7)} onTabPress={(tab) => handleTabPress(tab)}
          />
        )}
        {(idx === 18 || idx === 19 || idx === 20 || idx === 21) && (
          <S14_Profile
            lang={lang} setLang={setLang} isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode} theme={theme} profile={farmerProfile}
            setProfile={setFarmerProfile} onBack={() => setIdx(7)} onLogout={handleLogout}
            initialTab={idx === 19 ? 'Logs' : (idx === 21 ? 'Help' : 'Set')}
          />
        )}
        {idx === 22 && (
          <S18_AlertHistory
            lang={lang} theme={theme} farmerId={farmerId || farmerProfile?.id}
            onBack={() => setIdx(7)} onNext={(f) => { if (f) setSelField(f); setIdx(9); }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LocalizationProvider>
        <MainApp />
      </LocalizationProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.warmWhite,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0,
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warmWhite,
  }
});
