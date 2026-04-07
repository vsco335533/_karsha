import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Hdr } from '../../components/Shared';
import { BACKEND_URL } from '../../constants';
import { styles } from './styles';

export const S10_Analysis = (props) => {
    const { onNext, onBack, lang, field, setAnalysisData, theme } = props;
    const [progress, setProgress] = useState(0);
    const steps = [
        { te: 'ప్రారంభం', hi: 'आरंभ हो रहा है', en: 'Initializing Satellite Pipeline' },
        { te: 'చిత్ర సేకరణ', hi: 'दृश्य प्राप्त किया जा रहा है', en: 'Fetching Latest Sentinel-2 Scene' },
        { te: 'మేఘాల తనిఖీ', hi: 'बादलों की जांच', en: 'Measuring Farm Cloud Cover' },
        { te: 'సూచికల లెక్కింపు', hi: 'NDVI गणना', en: 'Calculating Spectral Indices (NDVI)' },
        { te: 'ఒత్తిడి గుర్తింపు', hi: 'तनाव क्षेत्र की पहचान', en: 'Detecting Stress Zones' },
        { te: 'పూర్తి', hi: 'विश्लेषण पूरा', en: 'Analysis Complete' },
    ];

    useEffect(() => {
        let active = true;
        const doAnalyze = async () => {
            for (let i = 0; i <= 4; i++) {
                if (!active) return;
                setProgress(i);
                await new Promise(r => setTimeout(r, 400));
            }
            try {
                const resp = await fetch(`${BACKEND_URL}/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', "bypass-tunnel-reminder": "1" },
                    body: JSON.stringify({
                        coordinates: field?.coordinates?.map(p => [p[0], p[1]]) || [],
                        lookback_days: 60,
                        farm_id: field?.id
                    })
                });
                const data = await resp.json();
                if (!active) return;
                setAnalysisData(data);
                setProgress(5);
                setTimeout(() => { if (active) onNext(); }, 1200);
            } catch (e) {
                if (active) {
                    Alert.alert("Analysis Failed", "Could not reach satellite engine.");
                    onBack();
                }
            }
        };
        doAnalyze();
        return () => { active = false; };
    }, []);

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.hdrRow, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => onBack?.()} style={{ paddingRight: 8 }}>
                    <MaterialCommunityIcons name="arrow-left-thick" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.hdrTitleSmall}>{lang === 'te' ? 'AI శాటిలైట్ విశ్లేషణ' : (lang === 'hi' ? 'AI सैटेलाइट विश्लेषण' : 'AI Satellite Analysis')}</Text>
            </View>
            <View style={[styles.loaderBox, { backgroundColor: theme.primary + '20' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Hdr theme={theme} style={{ marginTop: 20 }}>{lang === 'te' ? 'విశ్లేషణ జరుగుతోంది' : (lang === 'hi' ? 'विश्लेषण चल रहा है' : 'Analysis in Progress')}</Hdr>
            </View>
            <View style={{ padding: 24 }}>
                {steps.map((s, i) => (
                    <View key={i} style={[styles.stepRow, { opacity: i <= progress ? 1 : 0.3 }]}>
                        <View style={[styles.stepDot, i < progress && { backgroundColor: COLORS.lime }, { backgroundColor: i < progress ? COLORS.lime : theme.border }]} />
                        <Text style={[styles.stepText, { color: theme.text }, i === progress && { fontWeight: '800', color: theme.primary }]}>
                            {lang === 'te' ? s.te : (lang === 'hi' ? s.hi : s.en)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};
