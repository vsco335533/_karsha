import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Hdr, Lbl, Btn, Input } from '../../components/Shared';
import { BACKEND_URL } from '../../constants';
import { styles } from './styles';

export const S2_Profile = ({ next, back, lang, profile, setProfile, setFarmerId }) => {
    const [loading, setLoading] = useState(false);
    const update = (k, v) => setProfile(prev => ({ ...prev, [k]: v }));

    const validatePhone = (num) => {
        const regex = /^[6-9]\d{9}$/;
        return regex.test(num);
    };

    const handleNext = async () => {
        if (!validatePhone(profile.phone)) {
            Alert.alert(
                lang === 'te' ? "కోలుకోలేని ఫోన్ నంబర్" : (lang === 'hi' ? "अमान्य फ़ोन नंबर" : "Invalid Phone Number"),
                lang === 'te' ? "దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి." : (lang === 'hi' ? "कृपया एक सही 10 अंकों का फ़ोन नंबर दर्ज करें।" : "Please enter a valid 10-digit phone number.")
            );
            return;
        }

        setLoading(true);
        try {
            const resp = await fetch(`${BACKEND_URL}/farmers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "bypass-tunnel-reminder": "1"
                },
                body: JSON.stringify(profile)
            });
            if (!resp.ok) throw new Error("Failed to register");
            const data = await resp.json();
            if (!data || !data.id) {
                throw new Error("Server did not return a valid ID");
            }
            setProfile(prev => ({ ...prev, id: data.id })); // Ensure ID is in profile object for persistence
            setFarmerId(data.id);
            next();
        } catch (err) {
            Alert.alert(
                "Connection Error",
                `Could not connect to:\n${BACKEND_URL}\n\nEnsure the backend is running and you have "unlocked" the tunnel by visiting this URL once in your phone's browser.`
            );
        } finally {
            setLoading(false);
        }
    };

    const canNext = profile.name && profile.phone && profile.village;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.full}
        >
            <Hdr onBack={back} sub={lang === 'te' ? 'రైతు వివరాలు' : (lang === 'hi' ? 'किसान विवरण' : 'Farmer Details')}>
                {lang === 'te' ? 'రైతు ప్రొఫైల్' : (lang === 'hi' ? 'किसान प्रोफ़ाइल' : 'Farmer Profile')}
            </Hdr>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.avatar}>
                    <MaterialCommunityIcons name="account" size={50} color={COLORS.forest} />
                </View>
                <Lbl>{lang === 'te' ? 'పేరు' : (lang === 'hi' ? 'नाम' : 'Name')}</Lbl>
                <Input value={profile.name} onChange={v => update('name', v)} placeholder="e.g. Ramu Nayak" />
                <Lbl>{lang === 'te' ? 'ఫోన్ నంబర్' : (lang === 'hi' ? 'फ़ोन' : 'Phone')}</Lbl>
                <Input value={profile.phone} onChange={v => update('phone', v)} keyboardType="phone-pad" placeholder="9876543210" />
                <Lbl>{lang === 'te' ? 'గ్రామం' : (lang === 'hi' ? 'గాँव' : 'Village')}</Lbl>
                <Input value={profile.village} onChange={v => update('village', v)} placeholder="e.g. Kadiri" />
                <Lbl>{lang === 'te' ? 'మండలం' : (lang === 'hi' ? 'मंडल' : 'Mandal')}</Lbl>
                <Input value={profile.mandal} onChange={v => update('mandal', v)} placeholder="e.g. Kadiri" />
                <Lbl>{lang === 'te' ? 'జిల్లా' : (lang === 'hi' ? 'जिला' : 'District')}</Lbl>
                <Input value={profile.district} onChange={v => update('district', v)} placeholder="e.g. Sri Sathya Sai" />
                <Btn onClick={handleNext} disabled={!canNext || loading} style={{ marginTop: 24 }}>
                    {loading ? '...' : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: '900' }}>{lang === 'te' ? 'తదుపరి ' : (lang === 'hi' ? 'अगला ' : 'Next ')}</Text>
                            <MaterialCommunityIcons name="arrow-right-thick" size={18} color="white" />
                        </View>
                    )}
                </Btn>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
