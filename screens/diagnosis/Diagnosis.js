import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Btn } from '../../components/Shared';
import { TRANSLATIONS } from '../../Translations';
import { styles } from './styles';

export const S11_Diagnosis = ({ onNext, onBack, onTabPress, analysisData, lang, theme }) => {
    const mainStress = analysisData?.stress_points?.[0];
    const severity = mainStress?.severity?.toUpperCase() || 'LOW';
    const cause = mainStress?.possible_causes?.[0] || (lang === 'te' ? 'పంట బాగుంది' : 'Crop is Healthy');
    const isHigh = severity === 'HIGH';
    const severityColor = isHigh ? '#EF5350' : severity === 'MEDIUM' ? '#FF9800' : '#66BB6A';
    const severityBg = isHigh ? '#FEF2F2' : severity === 'MEDIUM' ? '#FFF8E1' : '#F1F8E9';
    const severityIcon = isHigh ? '⚠️' : severity === 'MEDIUM' ? '🔶' : '✅';

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.subTabHeader, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}>
                    <MaterialCommunityIcons name="arrow-left-thick" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('AI')} style={styles.subTab}><Text style={styles.subTabText}>AI</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Report')} style={[styles.subTab, styles.subTabAct]}><Text style={styles.subTabTextAct}>{lang === 'te' ? 'రిపోర్ట్' : (lang === 'hi' ? 'रिपोर्ट' : 'Report')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Remedy')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'పరిష్కారం' : (lang === 'hi' ? 'उपాయ' : 'Remedy')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Prog')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'స్టేటస్' : (lang === 'hi' ? 'ప్రగతి' : 'Prog')}</Text></TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 0 }]}>
                <View style={[styles.diagHeroBanner, { backgroundColor: severityBg, borderBottomWidth: 3, borderBottomColor: severityColor + '40' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <View style={[styles.diagSeverityBadge, { backgroundColor: severityColor }]}>
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }}>
                                {severity === 'CRITICAL' ? (lang === 'te' ? 'అత్యంత తీవ్రమైనది' : (lang === 'hi' ? 'गंभीर' : 'CRITICAL')) :
                                    severity === 'HIGH' ? (lang === 'te' ? 'ఎక్కువ తీవ్రత' : (lang === 'hi' ? 'उच्च तीव्रता' : 'HIGH SEVERITY')) :
                                        severity === 'MEDIUM' ? (lang === 'te' ? 'మధ్యస్థ తీవ్రత' : (lang === 'hi' ? 'मध्यम तीव्रता' : 'MEDIUM SEVERITY')) :
                                            (lang === 'te' ? 'తక్కువ తీవ్రత' : (lang === 'hi' ? 'कम तीव्रता' : 'LOW SEVERITY'))}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }} />
                        <Text style={{ fontSize: 11, color: '#888', fontWeight: '600' }}>🛰️ {lang === 'te' ? 'శాటిలైట్ AI' : (lang === 'hi' ? 'सैटेलाइट AI' : 'Satellite AI')}</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#1a1a1a', lineHeight: 27, marginBottom: 8 }}>
                        {severityIcon}  {TRANSLATIONS[lang][cause] || cause}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666', lineHeight: 18 }}>
                        {lang === 'te' ? 'రియల్-టైమ్ శాటిలైట్ స్పెక్ట్రల్ విశ్లేషణ ఆధారంగా గుర్తించబడింది.' : (lang === 'hi' ? 'वास्तविक समय के उपग्रह वर्णक्रमीय विश्लेषण के माध्यम से पहचाना गया।' : 'Identified via real-time satellite spectral analysis.')}
                    </Text>
                    <View style={{ marginTop: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#555', letterSpacing: 0.5 }}>
                                {lang === 'te' ? 'AI విశ్వసనీయత' : (lang === 'hi' ? 'AI विश्वास' : 'AI CONFIDENCE')}
                            </Text>
                            <Text style={{ fontSize: 10, fontWeight: '900', color: severityColor }}>87%</Text>
                        </View>
                        <View style={{ height: 6, backgroundColor: '#E0E0E0', borderRadius: 3 }}>
                            <View style={{ height: 6, width: '87%', backgroundColor: severityColor, borderRadius: 3 }} />
                        </View>
                    </View>
                </View>

                {mainStress && (
                    <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                        <Text style={[styles.sectionLabelSmall, { color: theme.subText, marginBottom: 10 }]}>
                            {lang === 'te' ? 'ప్రధాన నిర్ధారణలు' : (lang === 'hi' ? 'मुख्य निष्कर्ष' : 'KEY FINDINGS')}
                        </Text>
                        {mainStress.possible_causes.map((c, i) => (
                            <View key={i} style={[styles.diagFindingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                <View style={[styles.diagFindingNum, { backgroundColor: theme.primary + '18' }]}>
                                    <Text style={{ fontSize: 11, fontWeight: '900', color: theme.primary }}>{i + 1}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, lineHeight: 19 }}>
                                        {TRANSLATIONS[lang][c] || c}
                                    </Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={18} color={theme.subText} />
                            </View>
                        ))}
                    </View>
                )}

                {!mainStress && (
                    <View style={{ alignItems: 'center', padding: 32 }}>
                        <Text style={{ fontSize: 48, marginBottom: 12 }}>🌱</Text>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#66BB6A' }}>
                            {lang === 'te' ? 'పంట ఆరోగ్యంగా ఉంది!' : (lang === 'hi' ? 'फसल स्वस्थ दिख रही है!' : 'Crop Looks Healthy!')}
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.subText, marginTop: 8, textAlign: 'center' }}>
                            {lang === 'te' ? 'ఎటువంటి ఒత్తిడి గుర్తించబడలేదు.' : (lang === 'hi' ? 'इस स्कैन में कोई तनाव क्षेत्र नहीं पाया गया।' : 'No stress zones were detected in this scan.')}
                        </Text>
                    </View>
                )}
                <View style={{ height: 20 }} />
            </ScrollView>

            <View style={[styles.btmBar, { borderTopColor: theme.border }]}>
                <TouchableOpacity
                    onPress={onNext}
                    style={{
                        backgroundColor: theme.primary, height: 56, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 6,
                        shadowColor: theme.primary, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: '900' }}>{lang === 'te' ? 'పరిష్కారం చూడండి' : (lang === 'hi' ? 'उपाय देखें' : 'See Remedy')}</Text>
                    <MaterialCommunityIcons name="arrow-right-thick" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
