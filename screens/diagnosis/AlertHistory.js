import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Card, FieldHeatmap } from '../../components/Shared';
import { BACKEND_URL, CROPS } from '../../constants';
import { styles, SCREEN_WIDTH } from './styles';

export const S18_AlertHistory = ({ onNext, onBack, lang, theme, farmerId }) => {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (farmerId) {
            fetch(`${BACKEND_URL}/farmers/${farmerId}/farms`, { headers: { "bypass-tunnel-reminder": "1" } })
                .then(res => res.json())
                .then(data => {
                    setFarms(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [farmerId]);

    const allAlerts = farms.flatMap(f => {
        const analysis = f.last_analysis;
        const stressPoints = analysis?.stress_points || analysis?.stress_zones || [];
        if (stressPoints.length === 0) return [];

        const cropInfo = CROPS.find(c => c.id === f.crop_type) || { icon: '🌱', en: f.crop_type, te: f.crop_type };
        const fName = f.name || (lang === 'te' ? cropInfo.te : cropInfo.en);

        return stressPoints.map((sp, idx) => ({
            id: `${f.id}-${idx}`, farmId: f.id, farmName: fName, cropIcon: cropInfo.icon,
            type: sp.possible_causes?.[0] || (lang === 'te' ? 'ఒత్తిడి గుర్తించబడింది' : (lang === 'hi' ? 'तनाव पाया गया' : 'Stress Detected')),
            severity: sp.severity || 'Medium', date: analysis.date || 'Recent',
            loc: sp.location || (lang === 'te' ? 'పొలంలో ఒత్తిడి' : (lang === 'hi' ? 'ज़ोन मिला' : 'Zone Found')),
            points: f.coordinates?.map(p => ({ x: p[0], y: p[1] })),
            stressCoords: Array.isArray(sp.coordinates) ? sp.coordinates : [sp.lat, sp.lon],
            metrics: sp.metrics
        }));
    });

    const handleNavigate = (coords) => {
        if (!coords || !coords[0]) {
            Alert.alert("No Location", "This stress point has no physical coordinates.");
            return;
        }
        const url = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}&travelmode=walking`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) Linking.openURL(url);
            else Alert.alert("Error", "Could not open map application.");
        });
    };

    const handleDeleteAlert = (alert) => {
        Alert.alert(
            lang === 'te' ? 'హెచ్చరికను తొలగించు' : (lang === 'hi' ? 'अलर्ट हटाएँ' : 'Dismiss Alert'),
            lang === 'te' ? 'మీరు ఈ హెచ్చరికను తొలగించాలనుకుంటున్నారా?' : (lang === 'hi' ? 'क्या आप वाकई इस अलर्ट को हटाना चाहते हैं?' : 'Are you sure you want to dismiss this alert?'),
            [
                { text: lang === 'te' ? 'కాదు' : (lang === 'hi' ? 'రद्द करें' : 'Cancel'), style: 'cancel' },
                {
                    text: lang === 'te' ? 'అవును' : (lang === 'hi' ? 'హటాएँ' : 'Dismiss'), style: 'destructive',
                    onPress: async () => {
                        const farm = farms.find(f => f.id === alert.farmId);
                        if (!farm || !farm.last_analysis) return;
                        const sPoints = farm.last_analysis.stress_points || farm.last_analysis.stress_zones || [];
                        const newSPoints = sPoints.filter((_, idx) => `${farm.id}-${idx}` !== alert.id);
                        const newAnalysis = {
                            ...farm.last_analysis, stress_points: newSPoints, alerts: newSPoints.length,
                            status: newSPoints.length > 0 ? 'stress' : 'healthy'
                        };
                        try {
                            const resp = await fetch(`${BACKEND_URL}/farms/${farm.id}`, {
                                method: 'PATCH', headers: { 'Content-Type': 'application/json', "bypass-tunnel-reminder": "1" },
                                body: JSON.stringify({ last_analysis: newAnalysis })
                            });
                            if (resp.ok) {
                                fetch(`${BACKEND_URL}/farmers/${farmerId}/farms`, { headers: { "bypass-tunnel-reminder": "1" } })
                                    .then(res => res.json()).then(data => setFarms(Array.isArray(data) ? data : []));
                            }
                        } catch (e) { Alert.alert("Error", "Failed to dismiss alert."); }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.hdrRow, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}><MaterialCommunityIcons name="arrow-left-thick" size={28} color="white" /></TouchableOpacity>
                <Text style={styles.hdrTitleSmall}>{lang === 'te' ? 'హెచ్చరికల చరిత్ర' : (lang === 'hi' ? 'अलर्ट इतिहास' : 'Alert History')}</Text>
            </View>

            {loading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={theme.primary} /></View> : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {allAlerts.length === 0 ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                            <Text style={{ fontSize: 48 }}>🔔</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.subText, marginTop: 16 }}>{lang === 'te' ? 'నమోదు చేసిన పొలాలు అన్నీ ఆరోగ్యంగా ఉన్నాయి!' : (lang === 'hi' ? 'कोई हालिया अलर्ट नहीं मिला' : 'No recent alerts found')}</Text>
                        </View>
                    ) : allAlerts.map(a => (
                        <Card theme={theme} key={a.id} style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
                            <View style={{ padding: 16, backgroundColor: theme.card }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.red + '15', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}><MaterialCommunityIcons name="bell-alert" size={24} color={COLORS.red} /></View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 14, fontWeight: '900', color: theme.text, flex: 1, paddingRight: 8 }}>{a.type}</Text>
                                                <TouchableOpacity onPress={() => handleDeleteAlert(a)} style={{ padding: 4 }}><MaterialCommunityIcons name="close" size={18} color={theme.subText} /></TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                                <View style={{ backgroundColor: a.severity === 'high' || a.severity === 'critical' ? COLORS.red + '15' : (a.severity === 'medium' ? COLORS.amber + '15' : COLORS.lime + '15'), paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
                                                    <Text style={{ fontSize: 9, fontWeight: '800', color: a.severity === 'high' || a.severity === 'critical' ? COLORS.red : (a.severity === 'medium' ? COLORS.amber : COLORS.lime) }}>{a.severity.toUpperCase()}</Text>
                                                </View>
                                                <Text style={{ fontSize: 11, color: theme.subText, fontWeight: '700' }}>{a.date}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: 180, backgroundColor: theme.primary + '10' }}>
                                <FieldHeatmap theme={theme} points={a.points} stressPoint={a.stressCoords} mini width={SCREEN_WIDTH - 44} height={180} />
                            </View>
                            <View style={{ padding: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.border + '30', paddingBottom: 12, marginBottom: 12 }}>
                                    <View><Text style={{ fontSize: 9, fontWeight: '800', color: theme.subText }}>{lang === 'hi' ? 'खेत' : 'FIELD'}</Text><Text style={{ fontSize: 12, fontWeight: '700', color: theme.text, marginTop: 2 }}>{a.cropIcon} {a.farmName}</Text></View>
                                    <View style={{ alignItems: 'flex-end' }}><Text style={{ fontSize: 9, fontWeight: '800', color: theme.subText }}>{lang === 'hi' ? 'प्रभावित क्षेत्र' : 'AFFECTED ZONE'}</Text><Text style={{ fontSize: 12, fontWeight: '700', color: theme.text, marginTop: 2 }}>{a.loc}</Text></View>
                                </View>
                                <TouchableOpacity onPress={() => handleNavigate(a.stressCoords)} style={{ backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12 }}>
                                    <Text style={{ color: 'white', fontWeight: '900', fontSize: 13, marginRight: 8 }}>{lang === 'te' ? 'ఒత్తిడి ఉన్న ప్రదేశానికి వెళ్ళండి' : (lang === 'hi' ? 'तनाव क्षेत्र पर जाएँ' : 'Navigate to Stress Zone')} 📍</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
