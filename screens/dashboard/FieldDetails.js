import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Hdr, Card, Btn, FieldHeatmap, Lbl } from '../../components/Shared';
import { useLocalization } from '../../components/LocalizationContext';
import { CROPS } from '../../constants';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const S7_FieldDetail = ({ onBack, onAnalyze, field, analysisData, lang, theme }) => {
    const { t } = useLocalization();
    if (!field) {
        return (
            <View style={[styles.full, { backgroundColor: theme.background }]}>
                <Hdr theme={theme} onBack={onBack}>{t('fieldDetail')}</Hdr>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                    <Text style={{ fontSize: 40, marginBottom: 20 }}>🌾</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.primary, textAlign: 'center' }}>
                        {t('selectFieldToView')}
                    </Text>
                    <Btn theme={theme} onClick={onBack} style={{ marginTop: 20 }}>
                        {t('goBack')}
                    </Btn>
                </View>
            </View>
        );
    }
    const crop = CROPS.find(c => c.id === field.crop_type) || CROPS[0];

    // Priority: session data > database persistent data
    const apiData = analysisData || field.last_analysis;
    const hasData = !!apiData;

    // Check if apiData is from session (full response) or DB (compact summary)
    const ndvi = apiData?.field_summary ? apiData.field_summary.mean_ndvi.toFixed(2) : (apiData?.ndvi?.toFixed(2) || "—");
    const ndwi = apiData?.field_summary ? apiData.field_summary.mean_ndwi.toFixed(2) : (apiData?.ndwi?.toFixed(2) || "—");
    const healthy = apiData?.field_summary ? Math.round(apiData.field_summary.healthy_area_pct) : (apiData?.healthy_pct ? Math.round(apiData.healthy_pct) : 0);
    const date = apiData?.image_date || apiData?.date || "Not scanned";
    const healthStatus = apiData?.status || "normal";

    // Dynamic crop timeline based on actual sowing date
    const daysSinceSowing = field.sowing_date
        ? Math.max(0, Math.floor((Date.now() - new Date(field.sowing_date).getTime()) / 86400000))
        : 0;

    const stages = [
        { nameKey: "sowing", day: 0 },
        { nameKey: "germination", day: 7 },
        { nameKey: "growth", day: 21 },
        { nameKey: "flowering", day: 35 },
        { nameKey: "harvest", day: 110 },
    ];

    const timeline = stages.map((st, i) => {
        const nextDay = stages[i + 1]?.day ?? Infinity;
        const current = daysSinceSowing >= st.day && daysSinceSowing < nextDay;
        const done = daysSinceSowing >= st.day;
        return { ...st, done, current };
    });

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={styles.detailCover}>
                <FieldHeatmap
                    theme={theme}
                    points={field.coordinates?.map(p => ({ latitude: p[0], longitude: p[1] }))}
                    status={healthStatus}
                    width={SCREEN_WIDTH}
                    height={220}
                />
                <TouchableOpacity onPress={onBack} style={styles.backBtnDet}>
                    <MaterialCommunityIcons name="arrow-left-thick" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.detailOverlay}>
                    <Hdr style={{ color: '#fff', fontSize: 24 }}>{crop.icon} {crop[lang] || crop.en}</Hdr>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>
                        {field.area_acres} {t('acres')} • {t('lastScan')}: {date}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.statsRow}>
                    {[{ l: "NDVI", v: ndvi, c: COLORS.lime, d: t('growth') },
                    { l: "NDWI", v: ndwi, c: COLORS.blue, d: t('moisture') || 'Moisture' },
                    { l: t('health'), v: `${healthy}%`, c: theme.primary, d: t('overall') }].map((s, i) => (
                        <Card theme={theme} key={i} style={styles.statCard}>
                            <Lbl theme={theme} style={{ fontSize: 8 }}>{s.l}</Lbl>
                            <Text style={[styles.statVal, { color: s.c, fontSize: 16 }]}>{s.v}</Text>
                            <Text style={{ fontSize: 9, color: theme.subText }}>{s.d}</Text>
                        </Card>
                    ))}
                </View>

                {analysisData?.warnings?.length > 0 && (
                    <Card theme={theme} style={{ backgroundColor: COLORS.amber + '15', marginBottom: 16, borderLeftWidth: 4, borderLeftColor: COLORS.amber }}>
                        <Text style={{ fontSize: 11, color: theme.text }}>⚠️ {analysisData.warnings[0]}</Text>
                    </Card>
                )}

                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                    <Btn theme={theme} style={{ flex: 1, height: 50, backgroundColor: theme.primary }} onClick={onAnalyze}>
                        {t('rescan')}
                    </Btn>
                    {hasData && (
                        <Btn theme={theme} style={{ flex: 1, height: 50, backgroundColor: theme.surface === '#FFF' ? COLORS.deepOlive : theme.card }} onClick={() => onBack()}>
                            {t('viewMap')}
                        </Btn>
                    )}
                </View>

                <Card theme={theme} style={{ padding: 20 }}>
                    <Lbl theme={theme} style={{ marginBottom: 16 }}>{t('cropStageTimeline')}</Lbl>
                    <View style={{ paddingLeft: 10 }}>
                        {timeline.map((st, i) => (
                            <View key={i} style={styles.tlRow}>
                                <View style={[styles.tlDot, st.current && styles.tlDotActive, st.done && !st.current && { backgroundColor: COLORS.lime }, st.current && { borderColor: theme.primary + '40' }]} />
                                {i < timeline.length - 1 && <View style={[styles.tlLine, { backgroundColor: theme.border }]} />}
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.tlText, { color: theme.subText }, st.current && { fontWeight: '900', color: theme.text }]}>
                                            {t(st.nameKey)}
                                        </Text>
                                        {st.current && <Text style={[styles.nowBdg, { backgroundColor: theme.primary + '20', color: theme.primary }]}>{t('now')}</Text>}
                                    </View>
                                    <Text style={{ fontSize: 10, color: theme.subText, marginTop: 2 }}>{t('dayLbl')} {st.day}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
};
