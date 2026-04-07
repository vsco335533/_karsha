import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Hdr, Lbl, Btn, Input } from '../../components/Shared';
import { BACKEND_URL, setBackendUrl } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
import { Alert } from 'react-native';

const LOGO = require('../../assets/logo.png');

export const S1_Welcome = ({ next, lang, setLang, theme, setFarmerProfile, setFarmerId, goTo }) => {
    const [mode, setMode] = useState('choice'); // 'choice' or 'login'
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
    }, [lang]);

    const handleLogin = async () => {
        if (!name || name.trim().length < 3) {
            setError(lang === 'te' ? 'దయచేసి కనీసం 3 అక్షరాల పేరును నమోదు చేయండి' : (lang === 'hi' ? 'कृपया कम से कम 3 अक्षरों का नाम दर्ज करें' : 'Please enter a name with at least 3 characters'));
            return;
        }
        if (!phone || phone.length < 10) {
            setError(lang === 'te' ? 'దయచేసి సరైన ఫోన్ నంబర్ నమోదు చేయండి' : (lang === 'hi' ? 'कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number'));
            return;
        }
        setError('');
        setLoading(true);
        try {
            // Find farmer by phone
            const resp = await fetch(`${BACKEND_URL}/farmers?phone=${phone}`, {
                headers: { "bypass-tunnel-reminder": "1" }
            });
            const data = await resp.json();

            // If data is an array and has a match
            const existingFarmer = Array.isArray(data) ? data.find(f => f.phone === phone) : (data?.phone === phone ? data : null);

            if (existingFarmer) {
                setFarmerProfile(existingFarmer);
                setFarmerId(existingFarmer.id);
                goTo(7); // Straight to Dashboard
            } else {
                setError(lang === 'te' ? 'వినియోగదారు కనుగొనబడలేదు. దయచేసి రిజిస్టర్ చేయండి.' : (lang === 'hi' ? 'उपयोगकर्ता नहीं मिला। कृपया रजिस्टर करें।' : 'User not found. Please Register.'));
            }
        } catch (e) {
            setError(lang === 'te' ? 'కనెక్షన్ సమస్య' : (lang === 'hi' ? 'कनेクション त्रुटि। फिर से कोशिश करें।' : 'Connection error. Try again.'));
            Alert.alert(
                "Connection Details",
                `Attempted to connect to:\n${BACKEND_URL}\n\nIf this URL is incorrect, long-press the 'Karsha' title on the welcome screen to update it.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.fullCenter}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onLongPress={() => {
                            Alert.prompt(
                                "Configure Backend",
                                "Enter Backend URL (e.g., https://karsha.onrender.com)",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Update",
                                        onPress: async (url) => {
                                            if (url && url.startsWith('http')) {
                                                await AsyncStorage.setItem('karsha_api', url);
                                                setBackendUrl(url);
                                                Alert.alert("Success", "Backend URL updated. Please restart the app.");
                                            }
                                        }
                                    }
                                ],
                                "plain-text",
                                BACKEND_URL
                            );
                        }}
                    >
                        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                    </TouchableOpacity>
                    <Hdr style={{ marginBottom: 4 }}>{lang === 'te' ? 'కర్ష' : (lang === 'hi' ? 'కర్షా' : 'Karsha')}</Hdr>
                    <Text style={styles.subBrand}>KARSHA</Text>

                    {mode === 'choice' && (
                        <Text style={styles.heroText}>
                            {lang === 'te' ? 'మీ పొలం ఆరోగ్యాన్ని ఉపగ్రహ సాంకేతికతతో పర్యవేక్షించండి' : (lang === 'hi' ? 'सैटेलाइट इंटेलिजेंस के साथ अपने खेत के स्वास्थ्य की निगरानी करें' : 'Monitor your field health with satellite intelligence')}
                        </Text>
                    )}

                    <View style={styles.divider} />

                    <View style={{ width: '100%', maxWidth: 320 }}>
                        {mode === 'choice' ? (
                            <>
                                <Lbl style={{ textAlign: 'center', marginBottom: 12 }}>LANGUAGE / భాష</Lbl>
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 32 }}>
                                    {[
                                        { id: 'te', n: 'తెలుగు', l: 'తె' },
                                        { id: 'hi', n: 'हिन्दी', l: 'हि' },
                                        { id: 'en', n: 'English', l: 'En' }
                                    ].map(l => (
                                        <TouchableOpacity
                                            key={l.id}
                                            onPress={() => setLang(l.id)}
                                            style={[styles.langCard, lang === l.id && styles.langCardActive]}
                                        >
                                            <Text style={[styles.langChar, lang === l.id && { color: COLORS.deepOlive }]}>{l.l}</Text>
                                            <Text style={styles.langName}>{l.n}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Btn onClick={() => setMode('login')} style={{ marginBottom: 12, backgroundColor: COLORS.forest }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontWeight: '900' }}>{lang === 'te' ? 'లాగిన్ ' : (lang === 'hi' ? 'लॉगिन ' : 'LOGIN ')}</Text>
                                        <MaterialCommunityIcons name="login" size={18} color="white" />
                                    </View>
                                </Btn>
                                <Btn onClick={() => {
                                    setFarmerProfile({ name: '', phone: '', village: '', mandal: '', district: '' });
                                    next();
                                }} variant="outline">
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: COLORS.deepOlive, fontWeight: '900' }}>{lang === 'te' ? 'రిజిస్టర్ ' : (lang === 'hi' ? 'रजिस्टर ' : 'REGISTER ')}</Text>
                                        <MaterialCommunityIcons name="account-plus" size={18} color={COLORS.deepOlive} />
                                    </View>
                                </Btn>
                            </>
                        ) : (
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                    <TouchableOpacity onPress={() => setMode('choice')}>
                                        <MaterialCommunityIcons name="arrow-left-thick" size={24} color={COLORS.forest} />
                                    </TouchableOpacity>
                                    <Hdr style={{ marginBottom: 0 }}>{lang === 'te' ? 'లాగిన్' : (lang === 'hi' ? 'लॉगिन' : 'Login')}</Hdr>
                                </View>

                                <Lbl style={{ marginBottom: 8 }}>{lang === 'te' ? 'పేరు' : (lang === 'hi' ? 'नाम' : 'Name')}</Lbl>
                                <Input
                                    theme={theme}
                                    value={name}
                                    onChange={(v) => { setName(v); setError(''); }}
                                    placeholder="e.g. Ramu Nayak"
                                    style={{ fontSize: 16, fontWeight: '700', marginBottom: 16 }}
                                />

                                <Lbl style={{ marginBottom: 8 }}>{lang === 'te' ? 'మొబైల్' : (lang === 'hi' ? 'मोबाइल' : 'Mobile')}</Lbl>
                                <Input
                                    theme={theme}
                                    value={phone}
                                    onChange={(v) => { setPhone(v); setError(''); }}
                                    placeholder="e.g. 9848022338"
                                    keyboardType="phone-pad"
                                    style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}
                                />

                                {error ? <Text style={{ color: COLORS.red, fontSize: 12, fontWeight: '700', marginBottom: 16, textAlign: 'center' }}>{error}</Text> : null}

                                <Btn onClick={handleLogin} disabled={loading} style={{ marginTop: 10 }}>
                                    {loading ? '...' : (lang === 'te' ? 'కొనసాగించు' : (lang === 'hi' ? 'जारी रखें' : 'Continue'))}
                                </Btn>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
