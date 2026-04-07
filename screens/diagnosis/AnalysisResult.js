import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Btn, Card } from '../../components/Shared';
import { TRANSLATIONS } from '../../Translations';
import { LEAFLET_JS } from '../../assets/leaflet_dist';
import { LEAFLET_CSS } from '../../assets/leaflet_css';
import { styles } from './styles';

const getResultsMapHtml = (field, zones, theme) => {
    const center = field?.coordinates?.[0] || [0, 0];
    const boundary = JSON.stringify(field?.coordinates?.map(p => [p[0], p[1]]) || []);
    const markers = JSON.stringify(zones.map((z, i) => ({
        lat: z.coordinates[0],
        lon: z.coordinates[1],
        severity: z.severity,
        id: i + 1
    })));

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
        ${LEAFLET_CSS}
        body { margin: 0; padding: 0; background: ${theme.background}; overflow: hidden; }
        #map { height: 100vh; width: 100vw; }
        .marker-pin {
            width: 26px; height: 26px; border-radius: 50% 50% 50% 0;
            background: #EF5350; position: absolute; transform: rotate(-45deg);
            left: 50%; top: 50%; margin: -13px 0 0 -13px;
            display: flex; align-items: center; justify-content: center;
            border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .marker-pin span { transform: rotate(45deg); color: white; font-weight: 900; font-size: 11px; }
    </style>
    <script>${LEAFLET_JS}</script>
</head>
<body>
    <div id="map"></div>
    <script>
        const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${center[0]}, ${center[1]}], 16);
        L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            subdomains:['mt0','mt1','mt2','mt3']
        }).addTo(map);

        const boundary = ${boundary};
        if (boundary.length > 0) {
            const poly = L.polygon(boundary, { color: '#2E7D32', weight: 3, fillColor: '#4CAF50', fillOpacity: 0.15 }).addTo(map);
            map.fitBounds(poly.getBounds(), { padding: [30, 30] });
        }

        const markers = ${markers};
        markers.forEach(m => {
            const color = m.severity === 'high' || m.severity === 'critical' ? '#EF5350' : (m.severity === 'medium' ? '#FF9800' : '#66BB6A');
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:" + color + ";' class='marker-pin'><span>" + m.id + "</span></div>",
                iconSize: [26, 38],
                iconAnchor: [13, 38]
            });
            L.marker([m.lat, m.lon], { icon: icon }).addTo(map);
        });
    </script>
</body>
</html>
    `;
};

export const S10c_AnalysisResult = ({ onNext, onBack, analysisData, lang, theme, field }) => {
    const zones = analysisData?.stress_points || [];
    const summary = analysisData?.field_summary || {};
    const warnings = analysisData?.warnings || [];
    const hasStress = zones.length > 0;

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.hdrRow, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}>
                    <MaterialCommunityIcons name="arrow-left-thick" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.hdrTitleSmall}>{lang === 'te' ? 'విశ్లేషణ ఫలితాలు' : (lang === 'hi' ? 'विश्लेषण परिणाम' : 'Analysis Results')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 1. TOP SUMMARY SECTION */}
                <View style={[styles.summaryGrid, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{lang === 'te' ? 'చిత్రం తేదీ' : (lang === 'hi' ? 'छवि तिथि' : 'Image Date')}</Text>
                        <Text style={[styles.summaryVal, { color: theme.text }]}>{analysisData?.image_date || 'N/A'}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{lang === 'te' ? 'ఉపగ్రహం' : (lang === 'hi' ? 'सैटेलाइट' : 'Satellite')}</Text>
                        <Text style={[styles.summaryVal, { color: theme.text }]}>{analysisData?.satellite || 'Sentinel-2 L2A'}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{lang === 'te' ? 'రిజల్యూషన్' : (lang === 'hi' ? 'रिज़ॉल्यूशन' : 'Resolution')}</Text>
                        <Text style={[styles.summaryVal, { color: theme.text }]}>{analysisData?.resolution_m || 10}m/px</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{lang === 'te' ? 'మేఘాల కవచం' : (lang === 'hi' ? 'बादल कवर' : 'Cloud cover')}</Text>
                        <Text style={[styles.summaryVal, { color: theme.text }]}>{analysisData?.farm_cloud_cover_pct?.toFixed(1) || '0.0'}%</Text>
                    </View>
                </View>

                {/* 2. WARNINGS SECTION */}
                {warnings.length > 0 && (
                    <View style={styles.warningBox}>
                        <MaterialCommunityIcons name="alert-outline" size={18} color="#D84315" />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            {warnings.map((w, i) => <Text key={i} style={styles.warningText}>⚠️ {w}</Text>)}
                        </View>
                    </View>
                )}

                {/* 3. FARM HEALTH SECTION */}
                <View style={{ marginBottom: 25 }}>
                    <Text style={[styles.sectionLabelSmall, { color: theme.subText, marginBottom: 12 }]}>{lang === 'te' ? 'పొలం ఆరోగ్య సారాంశం' : (lang === 'hi' ? 'खेत स्वास्थ्य सारांश' : 'FARM HEALTH SUMMARY')}</Text>
                    <View style={[styles.healthGrid, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.healthRow}>
                            <View style={[styles.healthDot, { backgroundColor: '#66BB6A' }]} />
                            <Text style={[styles.healthLabel, { color: theme.subText }]}>{lang === 'te' ? 'ఆరోగ్యకరమైన ప్రాంతం' : (lang === 'hi' ? 'स्वस्थ क्षेत्र' : 'Healthy Area')}</Text>
                            <Text style={[styles.healthVal, { color: '#2E7D32' }]}>{summary.healthy_area_pct?.toFixed(1)}%</Text>
                        </View>
                        <View style={[styles.healthRow, { borderTopWidth: 1, borderTopColor: theme.border }]}>
                            <View style={[styles.healthDot, { backgroundColor: '#FF9800' }]} />
                            <Text style={[styles.healthLabel, { color: theme.subText }]}>{lang === 'te' ? 'మితమైన ఒత్తిడి' : (lang === 'hi' ? 'मध्यम तनाव' : 'Moderate Stress')}</Text>
                            <Text style={[styles.healthVal, { color: '#E65100' }]}>{summary.moderate_area_pct?.toFixed(1)}%</Text>
                        </View>
                        <View style={[styles.healthRow, { borderTopWidth: 1, borderTopColor: theme.border }]}>
                            <View style={[styles.healthDot, { backgroundColor: '#EF5350' }]} />
                            <Text style={[styles.healthLabel, { color: theme.subText }]}>{lang === 'te' ? 'ఒత్తిడి ఉన్న ప్రాంతం' : (lang === 'hi' ? 'तनावग्रस्त क्षेत्र' : 'Stressed Area')}</Text>
                            <Text style={[styles.healthVal, { color: '#B71C1C' }]}>{summary.stressed_area_pct?.toFixed(1)}%</Text>
                        </View>
                    </View>
                </View>

                {/* 4. STRESS ZONES SECTION */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Text style={[styles.sectionLabelSmall, { color: theme.subText, marginBottom: 0 }]}>{lang === 'te' ? 'గుర్తించిన ఒత్తిడి ప్రాంతాలు' : (lang === 'hi' ? 'पहचाने गए तनाव क्षेत्र' : 'DETECTED STRESS ZONES')}</Text>
                    <View style={{ backgroundColor: theme.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: theme.primary }}>{zones.length} {lang === 'te' ? 'ప్రాంతాలు' : (lang === 'hi' ? 'क्षेत्र' : 'ZONES')}</Text>
                    </View>
                </View>

                {!hasStress ? (
                    <View style={{ backgroundColor: theme.surface, padding: 25, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: theme.border, marginBottom: 20 }}>
                        <MaterialCommunityIcons name="check-decagram" size={48} color={COLORS.lime} />
                        <Text style={{ fontSize: 18, fontWeight: '900', color: theme.text, marginTop: 12 }}>{lang === 'te' ? 'ఒత్తిడి ఏమీ లేదు' : (lang === 'hi' ? 'कोई तनाव नहीं मिला' : 'No Stress Detected')}</Text>
                    </View>
                ) : (
                    zones.map((z, i) => {
                        const severity = z.severity?.toUpperCase() || 'LOW';
                        const isHigh = severity === 'HIGH' || severity === 'CRITICAL';
                        const severityColor = isHigh ? '#EF5350' : (severity === 'MEDIUM' ? '#FF9800' : '#66BB6A');
                        const severityBg = isHigh ? '#FFEBEE' : (severity === 'MEDIUM' ? '#FFF3E0' : '#E8F5E9');

                        return (
                            <View key={i} style={[styles.resultCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: theme.primary + '10', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                                            <Text style={{ fontSize: 10, fontWeight: '900', color: theme.primary }}>{i + 1}</Text>
                                        </View>
                                        <Text style={{ fontWeight: '800', color: theme.text, fontSize: 14 }}>{lang === 'te' ? 'ప్రాంతం' : (lang === 'hi' ? 'क्षेत्र' : 'Zone')} ID: #{i + 1}</Text>
                                    </View>
                                    <View style={[styles.severityBadgeSmall, { backgroundColor: severityBg }]}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: severityColor, marginRight: 6 }} />
                                        <Text style={{ color: severityColor, fontSize: 9, fontWeight: '900' }}>
                                            {severity === 'CRITICAL' ? (lang === 'te' ? 'అత్యంత తీవ్రమైనది' : (lang === 'hi' ? 'गंभीर' : 'CRITICAL')) :
                                                severity === 'HIGH' ? (lang === 'te' ? 'ఎక్కువ' : (lang === 'hi' ? 'उच्च' : 'HIGH')) :
                                                    severity === 'MEDIUM' ? (lang === 'te' ? 'మధ్యస్థం' : (lang === 'hi' ? 'मध्यम' : 'MEDIUM')) :
                                                        (lang === 'te' ? 'తక్కువ' : (lang === 'hi' ? 'कम' : 'LOW'))}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.resultDataRow}>
                                    <View style={{ flex: 1.2 }}>
                                        <Text style={styles.resultDataLabel}>{lang === 'te' ? 'విస్తీర్ణం (హెక్టార్లు)' : (lang === 'hi' ? 'क्षेत्र (हेक्टेयर)' : 'Area (Hectares)')}</Text>
                                        <Text style={[styles.resultDataValue, { color: theme.text }]}>{z.area_hectares?.toFixed(3)} ha</Text>
                                    </View>
                                    <View style={{ width: 1, height: '80%', backgroundColor: theme.border, marginHorizontal: 12 }} />
                                    <View style={{ flex: 2 }}>
                                        <Text style={styles.resultDataLabel}>{lang === 'te' ? 'నిర్ధారించిన సమస్యలు' : (lang === 'hi' ? 'पहचानी गई समस्याएँ' : 'Diagnosed Problems')}</Text>
                                        <Text style={[styles.resultDataValue, { color: theme.text }]} numberOfLines={2}>
                                            {z.possible_causes?.map(c => TRANSLATIONS[lang][c] || c).join(', ') || 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}

                {/* 5. RESULTS MAP SECTION */}
                <View style={{ marginTop: 10, marginBottom: 30 }}>
                    <Text style={[styles.sectionLabelSmall, { color: theme.subText, marginBottom: 12 }]}>{lang === 'te' ? 'విజువల్ స్కాన్ మ్యాప్' : (lang === 'hi' ? 'विजुअल स्कैन मैप' : 'VISUAL SCAN MAP')}</Text>
                    <View style={{ height: 260, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: theme.border }}>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: getResultsMapHtml(field, zones, theme) }}
                            style={{ flex: 1 }}
                            scrollEnabled={false}
                        />
                        <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' }}>
                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#666' }}>{lang === 'te' ? 'విశ్లేషణ మ్యాప్' : (lang === 'hi' ? 'विश्लेषण मानचित्र' : 'Post-Analysis Map')}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.btmBar, { borderTopColor: theme.border }]}>
                <Btn theme={theme} onClick={onNext} variant="primary">
                    {lang === 'te' ? 'తదుపరి' : 'Next'}
                    <MaterialCommunityIcons name="chevron-right" size={24} color="white" style={{ marginLeft: 4 }} />
                </Btn>
            </View>
        </View>
    );
};
