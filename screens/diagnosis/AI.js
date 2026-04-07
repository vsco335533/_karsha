import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Card, Btn, FieldHeatmap } from '../../components/Shared';
import { styles } from './styles';

export const S11_AI = ({ onNext, onBack, onTabPress, analysisData, lang, theme, field }) => {
    const [selectedZoneIdx, setSelectedZoneIdx] = useState(0);
    const stressPoints = analysisData?.stress_points || [];

    const handleNavigate = () => {
        const stressPoint = stressPoints[selectedZoneIdx];
        if (!stressPoint) {
            Alert.alert("No Stress Point", "No physical stress location found to navigate to.");
            return;
        }
        const [lat, lng] = stressPoint.coordinates;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert("Error", "Could not open map application.");
            }
        });
    };

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.subTabHeader, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}><MaterialCommunityIcons name="arrow-left-thick" size={24} color="white" /></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('AI')} style={[styles.subTab, styles.subTabAct]}><Text style={styles.subTabTextAct}>{lang === 'hi' ? 'एआई' : 'AI'}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Report')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'రిపోర్ట్' : (lang === 'hi' ? 'रिपोर्ट' : 'Report')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Remedy')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'పరిష్కారం' : (lang === 'hi' ? 'उपాయ' : 'Remedy')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Prog')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'స్టేటస్' : (lang === 'hi' ? 'ప్రగతి' : 'Prog')}</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={[styles.sectionLabelSmall, { color: theme.subText, marginBottom: 12 }]}>
                        {lang === 'te' ? 'AI స్కాన్ విశ్లేషణ' : (lang === 'hi' ? 'AI स्कैन विश्लेषण' : 'AI SCAN ANALYSIS')}
                    </Text>
                    <Card theme={theme} style={{ padding: 18, borderLeftWidth: 4, borderLeftColor: theme.primary }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, fontWeight: '800', color: theme.primary }}>
                                {lang === 'te' ? 'AI కాన్ఫిడెన్స్ స్కోర్' : (lang === 'hi' ? 'AI विश्वास स्कोर' : 'AI CONFIDENCE SCORE')}
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '900', color: theme.primary }}>87%</Text>
                        </View>
                        <View style={{ height: 10, backgroundColor: theme.primary + '15', borderRadius: 5, overflow: 'hidden' }}>
                            <View style={{ width: '87%', height: '100%', backgroundColor: theme.primary }} />
                        </View>
                        <Text style={{ fontSize: 12, color: theme.subText, marginTop: 14, lineHeight: 18 }}>
                            {lang === 'te' ? `స్పెక్ట్రల్ స్కాన్ పొలంలో వైవిధ్యాలను గుర్తించింది. మా డీప్ లెర్నింగ్ మోడల్ ఈ నమూనాలు ${field?.crop_type || 'ఈ పంట'} కోసం చారిత్రక ఒత్తిడి గుర్తులతో సరిపోలుతున్నాయని ధృవీకరిస్తుంది.` : (lang === 'hi' ? `स्पेक्ट्रल स्कैन ने खेत के भीतर विभिन्नताओं की पहचान की है। हमारा डीप लर्निंग मॉडल पुष्टि करता है कि ये पैटर्न ${field?.crop_type || 'इस फसल'} के लिए ऐतिहासिक तनाव मार्करों से मेल खाते हैं।` : `The spectral scan has identified within-field variations. Our deep learning model confirms these patterns match historical stress markers for ${field?.crop_type || 'this crop'}.`)}
                        </Text>
                    </Card>
                </View>

                {stressPoints.length > 1 && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={[styles.sectionLabelSmall, { color: theme.subText, marginBottom: 12 }]}>
                            {lang === 'te' ? 'ఒత్తిడి జోన్‌ను ఎంచుకోండి' : (lang === 'hi' ? 'तनाव क्षेत्र चुनें' : 'SELECT STRESS ZONE')}
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 5 }}>
                            {stressPoints.map((sp, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => setSelectedZoneIdx(i)}
                                    style={{
                                        backgroundColor: i === selectedZoneIdx ? theme.primary : theme.card,
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: i === selectedZoneIdx ? theme.primary : theme.border,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 8,
                                        elevation: i === selectedZoneIdx ? 4 : 0
                                    }}
                                >
                                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: i === selectedZoneIdx ? 'white' : theme.primary + '20', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 11, fontWeight: '900', color: theme.primary }}>{i + 1}</Text>
                                    </View>
                                    <Text style={{ color: i === selectedZoneIdx ? 'white' : theme.text, fontWeight: '800', fontSize: 13 }}>
                                        {lang === 'te' ? `జోన్ ${i + 1}` : (lang === 'hi' ? `क्षेत्र ${i + 1}` : `Zone ${i + 1}`)}
                                    </Text>
                                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#ff453a' }} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={[styles.sectionLabelSmall, { color: theme.subText, marginBottom: 0 }]}>
                            {lang === 'te' ? 'హీట్ మ్యాప్' : (lang === 'hi' ? 'हीटमैप' : 'SPECTRAL HEATMAP')}
                        </Text>
                        {stressPoints.length > 0 && (
                            <TouchableOpacity
                                onPress={handleNavigate}
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}
                            >
                                <MaterialCommunityIcons name="navigation-variant" size={14} color={theme.primary} />
                                <Text style={{ fontSize: 11, fontWeight: '800', color: theme.primary }}>
                                    {lang === 'te' ? 'నేవిగేట్' : (lang === 'hi' ? 'नेविगेट' : 'NAVIGATE')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ height: 320, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: theme.border }}>
                        <FieldHeatmap
                            theme={theme}
                            points={field?.coordinates?.map(p => ({ latitude: p[0], longitude: p[1] }))}
                            stressPoints={stressPoints.map(sp => sp.coordinates)}
                            selectedIdx={selectedZoneIdx}
                            status="stress"
                            width={Dimensions.get('window').width - 32}
                            height={320}
                        />
                    </View>

                    {stressPoints.length > 0 && (
                        <TouchableOpacity
                            onPress={handleNavigate}
                            style={{
                                backgroundColor: COLORS.white,
                                borderWidth: 1.5,
                                borderColor: theme.primary,
                                paddingVertical: 14,
                                borderRadius: 16,
                                marginTop: 16,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                                elevation: 2
                            }}
                        >
                            <MaterialCommunityIcons name="compass-outline" size={20} color={theme.primary} />
                            <Text style={{ color: theme.primary, fontWeight: '900', fontSize: 14 }}>
                                {lang === 'te' ? `జోన్ ${selectedZoneIdx + 1} కు వెళ్ళండి` : (lang === 'hi' ? `क्षेत्र ${selectedZoneIdx + 1} पर जाएं` : `Navigate to Zone ${selectedZoneIdx + 1}`)}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
            <View style={[styles.btmBar, { borderTopColor: theme.border }]}>
                <Btn theme={theme} onClick={onNext} variant="primary">
                    {lang === 'te' ? 'నివేదికను చూడు' : (lang === 'hi' ? 'रिपोर्ट देखें' : 'View Report')}
                    <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
                </Btn>
            </View>
        </View>
    );
};
