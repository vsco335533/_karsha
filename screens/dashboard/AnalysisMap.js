import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import { Hdr, Card, Btn, FieldHeatmap } from '../../components/Shared';
import { styles } from './styles';
import { useLocalization } from '../../components/LocalizationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const S9_AnalysisMap = ({ onBack, onDiagnosis, field, analysisData, theme }) => {
    const { t, lang } = useLocalization();
    if (!field) {
        return (
            <View style={[styles.full, { backgroundColor: theme.background }]}>
                <Hdr theme={theme} onBack={onBack}>{t('liveMap')}</Hdr>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                    <Text style={{ fontSize: 40, marginBottom: 20 }}>🗺️</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.primary, textAlign: 'center' }}>
                        {t('selectFieldMap')}
                    </Text>
                    <Btn theme={theme} onClick={onBack} style={{ marginTop: 20 }}>
                        {t('goBack')}
                    </Btn>
                </View>
            </View>
        );
    }

    const stressPoint = analysisData?.stress_points?.[0] ? {
        latitude: analysisData.stress_points[0].coordinates[0],
        longitude: analysisData.stress_points[0].coordinates[1]
    } : null;

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.fieldMapPlaceholder, { flex: 1, backgroundColor: theme.primary + '15' }]}>
                <FieldHeatmap
                    theme={theme}
                    points={field.coordinates?.map(p => ({ latitude: p[0], longitude: p[1] }))}
                    stressPoint={stressPoint}
                    status="stress"
                    width={SCREEN_WIDTH}
                    height={SCREEN_WIDTH * 1.5}
                />

                <TouchableOpacity onPress={onBack} style={styles.backBtnDet}>
                    <MaterialCommunityIcons name="arrow-left-thick" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.mapControls}>
                    <Card theme={theme} style={{ padding: 16 }}>
                        <Hdr theme={theme} style={{ fontSize: 16 }}>
                            {analysisData?.total_stress_zones > 0
                                ? `${analysisData.total_stress_zones} ${t('stressZonesDetected')}`
                                : t('noStressDetectedShort')
                            }
                        </Hdr>
                        <Text style={{ fontSize: 12, color: theme.subText, marginTop: 4 }}>
                            {analysisData?.stress_points?.[0]
                                ? `${t('primaryCause')}: ${analysisData.stress_points[0].possible_causes[0]}`
                                : t('cropHealthyDiag')}
                        </Text>
                        <Btn theme={theme} onClick={onDiagnosis} disabled={!analysisData?.stress_points?.length} style={{ marginTop: 16, height: 44 }}>
                            {t('seeRemedies')}
                        </Btn>
                    </Card>
                </View>
            </View>
        </View>
    );
};
