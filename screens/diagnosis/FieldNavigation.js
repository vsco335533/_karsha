import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Hdr, Lbl, FieldHeatmap } from '../../components/Shared';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const S9b_FieldNavigation = ({ onNext, onBack, lang, field, analysisData, theme }) => {
    const userPos = { x: 30, y: 70 };
    const stressPoint = analysisData?.stress_points?.[0] ? {
        x: analysisData.stress_points[0].coordinates[0],
        y: analysisData.stress_points[0].coordinates[1]
    } : { x: 80, y: 20 };
    const navInstructions = [
        { te: 'పొలం ఈశాన్య మూల వైపు వెళ్ళండి', hi: 'खेत के उत्तर-पूर्व कोने की ओर चलें', en: 'Walk towards the Northeast corner of your field' },
        { te: 'ఎరుపు రంగు మార్కర్ వరకు వెళ్ళండి', hi: 'नक्शे पर दिखाए गए लाल मार्कर की ओर बढ़ें', en: 'Head towards the red marker shown on map' },
        { te: 'కాలువ గట్టు వెంట నడక సాగించండి', hi: 'नहर के किनारे वाले रास्ते का पालन करें', en: 'Follow the canal bund path' },
    ];
    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <Hdr theme={theme} onBack={onBack}>{lang === 'te' ? 'పొలం నావిగేషన్' : (lang === 'hi' ? 'खेत नेविगेशन' : 'Field Navigation')}</Hdr>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{
                    backgroundColor: theme.primary, borderRadius: 20, padding: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16,
                    elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
                }}>
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name="compass-outline" size={32} color="white" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, fontWeight: '900', color: 'white' }}>{lang === 'te' ? 'ఈశాన్యం వైపు' : (lang === 'hi' ? 'उत्तर-पूर्व की ओर' : 'Towards Northeast')}</Text>
                        <Text style={{ fontSize: 13, color: 'white', opacity: 0.9, fontWeight: '600' }}>~120m {lang === 'te' ? 'దూరం' : (lang === 'hi' ? 'दूरी' : 'distance')} • NW Corner</Text>
                    </View>
                </View>

                <View style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: theme.card, elevation: 2, marginBottom: 12 }}>
                    <FieldHeatmap
                        theme={theme}
                        points={field?.coordinates?.map(p => ({ latitude: p[0], longitude: p[1] })) || [{ latitude: 16.506, longitude: 80.648 }, { latitude: 16.507, longitude: 80.649 }]}
                        userPos={userPos ? { latitude: userPos.latitude || 16.506, longitude: userPos.longitude || 80.648 } : null}
                        stressPoint={stressPoint ? { latitude: stressPoint.latitude || stressPoint.x, longitude: stressPoint.longitude || stressPoint.y } : null}
                        width={SCREEN_WIDTH - 32}
                        height={240}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.blue, borderWidth: 2, borderColor: 'white' }} />
                        <Text style={{ fontSize: 11, fontWeight: '800', color: theme.subText }}>{lang === 'te' ? 'మీ స్థానం' : (lang === 'hi' ? 'आपका स्थान' : 'Your Location')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.red, borderWidth: 2, borderColor: 'white' }} />
                        <Text style={{ fontSize: 11, fontWeight: '800', color: theme.subText }}>{lang === 'te' ? 'ఒత్తిడి ప్రాంతం' : (lang === 'hi' ? 'तनाव क्षेत्र' : 'Stress Zone')}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: theme.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: theme.border }}>
                    <Lbl theme={theme} style={{ marginBottom: 16, fontSize: 14 }}>{lang === 'te' ? 'నడక సూచనలు' : (lang === 'hi' ? 'चलने के निर्देश' : 'WALKING INSTRUCTIONS')}</Lbl>
                    {navInstructions.map((ins, i) => (
                        <View key={i} style={{ flexDirection: 'row', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
                            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: theme.primary + '15', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '900' }}>{i + 1}</Text>
                            </View>
                            <Text style={{ flex: 1, fontSize: 14, color: theme.text, fontWeight: '600', lineHeight: 20, marginTop: 4 }}>
                                {lang === 'te' ? ins.te : (lang === 'hi' ? ins.hi : ins.en)}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.btmBar, { backgroundColor: theme.background, borderTopWidth: 0 }]}>
                <TouchableOpacity
                    onPress={onNext}
                    style={{
                        backgroundColor: COLORS.forest, height: 60, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, elevation: 8,
                        shadowColor: COLORS.forest, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '900' }}>{lang === 'te' ? 'ప్రాంతానికి చేరుకున్నారు — తనిఖీ ప్రారంభించండి' : (lang === 'hi' ? 'क्षेत्र में पहुँच गए - निरीक्षण शुरू करें' : 'Reached Zone — Start Inspection')}</Text>
                    <MaterialCommunityIcons name="check-decagram" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
