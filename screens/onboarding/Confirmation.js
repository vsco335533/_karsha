import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Hdr, Lbl, Btn, Card, FieldHeatmap } from '../../components/Shared';
import { BACKEND_URL, CROPS, SOIL_TYPES, IRRIGATION } from '../../constants';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const S5_Confirm = ({ next, back, lang, profile, details, farmerId }) => {
    const [loading, setLoading] = useState(false);
    const cropObj = CROPS.find(c => c.id === details.crop_type) || CROPS[0];
    const soilObj = SOIL_TYPES.find(s => s.id === details.soil_type) || SOIL_TYPES[0];
    const irrObj = IRRIGATION.find(i => i.id === details.irrigation) || IRRIGATION[0];

    const handleConfirm = async () => {
        const payload = {
            farmer_id: parseInt(farmerId, 10) || farmerId,
            crop_type: details.crop_type,
            sowing_date: details.date || new Date().toISOString().split('T')[0],
            soil_type: details.soil_type,
            irrigation_type: details.irrigation || "borewell",
            coordinates: details.coordinates || [[15.5, 78.0], [15.501, 78.001], [15.502, 78.0]],
            area_acres: parseFloat(details.area) || 2.5
        };
        console.log("Sending payload:", JSON.stringify(payload));
        setLoading(true);
        try {
            const resp = await fetch(`${BACKEND_URL}/farms`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "bypass-tunnel-reminder": "1" },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            if (!resp.ok) {
                const msg = data?.detail ? JSON.stringify(data.detail) : (lang === 'hi' ? "अनजान त्रुटि" : "Unknown error");
                Alert.alert(lang === 'hi' ? "सेव एरर" : "Save Error", msg);
                return;
            }
            next();
        } catch (e) {
            Alert.alert(lang === 'te' ? "నెట్‌వర్క్ లోపం" : (lang === 'hi' ? "नेटवर्क त्रुटि" : "Connection Error"), (lang === 'te' ? "సర్వర్‌ను చేరుకోలేకపోయాము: " : (lang === 'hi' ? "सर्वर तक नहीं पहुँच सके: " : "Cannot reach backend at ")) + BACKEND_URL);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.full}>
            <Hdr onBack={back}>{lang === 'te' ? 'వివరాలు సరిచూసుకోండి' : (lang === 'hi' ? 'विवरण की पुष्टि करें' : 'Confirm Details')}</Hdr>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card style={{ marginBottom: 12 }}>
                    <Lbl>{lang === 'te' ? 'రైతు వివరాలు' : (lang === 'hi' ? 'किसान विवरण' : 'Farmer Details')}</Lbl>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.summaryVal}>{profile.name || 'N/A'}</Text>
                            <Text style={styles.summarySub}>📍 {profile.village || 'N/A'}</Text>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.forest }}>📞 {profile.phone || 'N/A'}</Text>
                    </View>
                    <Text style={{ fontSize: 10, color: COLORS.warmGray, marginTop: 4 }}>ID: {farmerId || 'PENDING'}</Text>
                </Card>

                <Card style={{ marginBottom: 12 }}>
                    <Lbl>{lang === 'te' ? 'పంట సారాంశం' : (lang === 'hi' ? 'फसल सारांश' : 'Crop Summary')}</Lbl>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 11, color: COLORS.warmGray }}>{lang === 'te' ? 'పంట' : (lang === 'hi' ? 'फसल' : 'Crop')}</Text>
                            <Text style={styles.summaryVal}>{cropObj.icon} {lang === 'te' ? cropObj.te : (lang === 'hi' ? cropObj.hi : cropObj.en)}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 11, color: COLORS.warmGray }}>{lang === 'te' ? 'విత్తిన తేదీ' : (lang === 'hi' ? 'बुवाई की तारीख' : 'Sowing Date')}</Text>
                            <Text style={styles.summaryVal}>{details.date || '--'}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                        <View>
                            <Text style={{ fontSize: 11, color: COLORS.warmGray }}>{lang === 'te' ? 'నేల' : (lang === 'hi' ? 'मिट्टी' : 'Soil')}</Text>
                            <Text style={styles.summaryVal}>{lang === 'te' ? soilObj.te : (lang === 'hi' ? soilObj.hi : soilObj.en)}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 11, color: COLORS.warmGray }}>{lang === 'te' ? 'నీరు' : (lang === 'hi' ? 'सिंचाई' : 'Irrigation')}</Text>
                            <Text style={styles.summaryVal}>{lang === 'te' ? irrObj.te : (lang === 'hi' ? irrObj.hi : irrObj.en)}</Text>
                        </View>
                    </View>
                </Card>

                <Card style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Lbl>{lang === 'te' ? 'పొలం హద్దులు' : (lang === 'hi' ? 'खेत की सीमा' : 'Field Boundary')}</Lbl>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.deepOlive }}>{details.area} Acres</Text>
                    </View>
                    <View style={{ height: 180, borderRadius: 12, overflow: 'hidden', backgroundColor: COLORS.forest + '20' }}>
                        <FieldHeatmap points={details.coordinates?.map(c => ({ x: Array.isArray(c) ? c[0] : c.x, y: Array.isArray(c) ? c[1] : c.y }))} width={SCREEN_WIDTH - 48} height={180} />
                    </View>
                </Card>

                <Btn onClick={handleConfirm} disabled={loading} style={{ marginTop: 20 }}>
                    {loading ? '...' : (lang === 'te' ? 'ధృవీకరించండి ✓' : (lang === 'hi' ? 'पुष्टि करें और शुरू करें ✓' : 'Confirm & Start ✓'))}
                </Btn>
            </ScrollView>
        </View>
    );
};
