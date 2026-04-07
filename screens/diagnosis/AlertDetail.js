import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Hdr, Card, Btn, FieldHeatmap } from '../../components/Shared';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const S8_Alerts = ({ onNext, onBack, lang, field, analysisData, theme }) => {
    const stressPoint = analysisData?.stress_points?.[0] ? {
        x: analysisData.stress_points[0].coordinates[0],
        y: analysisData.stress_points[0].coordinates[1]
    } : null;
    const scanDate = analysisData?.image_date || '--';
    const ndviVal = analysisData?.field_summary?.mean_ndvi?.toFixed(2) || '0.00';
    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <Hdr theme={theme} onBack={onBack}>{lang === 'te' ? 'ఫీల్డ్ హెచ్చరికలు' : (lang === 'hi' ? 'खेत की चेतावनी' : 'Field Alerts')}</Hdr>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card theme={theme} style={{ padding: 16, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.red + '20', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20 }}>🚨</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '900', color: theme.text }}>
                                    {lang === 'te' ? 'తేమ ఒత్తిడి గుర్తించబడింది' : (lang === 'hi' ? 'नमी के तनाव का पता चला' : 'Moisture Stress Detected')}
                                </Text>
                                <Text style={{ fontSize: 12, color: theme.subText }}>{lang === 'te' ? 'తేమ ఒత్తిడి గుర్తించబడింది' : (lang === 'hi' ? 'नमी के तनाव का पता चला' : 'Moisture Stress Detected')}</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: COLORS.amber + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                            <Text style={{ color: COLORS.amber, fontSize: 10, fontWeight: '800' }}>Medium</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <FieldHeatmap
                            theme={theme}
                            points={field?.coordinates?.map(p => ({ latitude: p[0], longitude: p[1] })) || [{ latitude: 16.506, longitude: 80.648 }]}
                            stressPoint={stressPoint ? { latitude: stressPoint.latitude || stressPoint.x, longitude: stressPoint.longitude || stressPoint.y } : null}
                            width={SCREEN_WIDTH - 72}
                            height={160}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, gap: 20 }}>
                        <View style={{ width: '45%' }}>
                            <Text style={{ fontSize: 10, color: theme.subText, fontWeight: '700' }}>Field</Text>
                            <Text style={{ fontSize: 13, fontWeight: '800', color: theme.text }}>📍 {field?.name || 'Canal Field'}</Text>
                        </View>
                        <View style={{ width: '45%' }}>
                            <Text style={{ fontSize: 10, color: theme.subText, fontWeight: '700' }}>Affected Zone</Text>
                            <Text style={{ fontSize: 13, fontWeight: '800', color: theme.text }}>NW Corner</Text>
                        </View>
                        <View style={{ width: '45%' }}>
                            <Text style={{ fontSize: 10, color: theme.subText, fontWeight: '700' }}>Detected Date</Text>
                            <Text style={{ fontSize: 13, fontWeight: '800', color: theme.text }}>{scanDate}</Text>
                        </View>
                        <View style={{ width: '45%' }}>
                            <Text style={{ fontSize: 10, color: theme.subText, fontWeight: '700' }}>NDVI Value</Text>
                            <Text style={{ fontSize: 13, fontWeight: '800', color: theme.text }}>{ndviVal}</Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>

            <View style={[styles.btmBar, { borderTopColor: theme.border }]}>
                <Btn theme={theme} onClick={onNext}>Navigate to Stress Zone 📍</Btn>
            </View>
        </View>
    );
};
