import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../theme';
import { Lbl, Btn, FieldHeatmap } from '../../components/Shared';
import { CROPS, SOIL_TYPES, IRRIGATION } from '../../constants';
import { styles } from './styles';

export const S3_Crop = ({ next, back, goTo, lang, details, setDetails, theme }) => {
    const [showPicker, setShowPicker] = useState(false);
    const update = (k, v) => setDetails(prev => ({ ...prev, [k]: v }));

    const handleNext = () => {
        if (!details.crop_type || !details.soil_type) {
            Alert.alert(lang === 'te' ? 'వివరాలు' : (lang === 'hi' ? 'विवरण' : 'Details'), lang === 'te' ? 'దయచేసి అన్ని వివరాలను ఎంచుకోండి' : (lang === 'hi' ? 'कृपया सभी विवरण चुनें' : 'Please select all details'));
            return;
        }
        next();
    };

    const onDateChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            update('date', selectedDate.toISOString().split('T')[0]);
        }
    };

    return (
        <View style={styles.full}>
            <View style={[styles.hdrRow, { borderBottomWidth: 0, paddingBottom: 0, backgroundColor: COLORS.warmWhite }]}>
                <TouchableOpacity onPress={() => goTo(7)} style={{ position: 'absolute', left: 20, top: 15 }}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.forest} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.forest }}>
                        {lang === 'te' ? 'పంట & నేల' : (lang === 'hi' ? 'फसल और मिट्टी' : 'Crop & Soil')}
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.warmGray, textTransform: 'uppercase', marginTop: 2 }}>
                        {lang === 'te' ? 'పొలం వివరాలు' : (lang === 'hi' ? 'फसल की जानकारी' : 'Field Info')}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 20, backgroundColor: COLORS.warmWhite }]}>
                {/* Crop Type Grid */}
                <Lbl style={{ color: COLORS.warmGray, fontSize: 13, marginBottom: 15 }}>
                    {lang === 'te' ? 'పంట రకం' : (lang === 'hi' ? 'फसल का प्रकार' : 'CROP TYPE')}
                </Lbl>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 25 }}>
                    {CROPS.map(c => (
                        <TouchableOpacity
                            key={c.id}
                            onPress={() => update('crop_type', c.id)}
                            activeOpacity={0.8}
                            style={[
                                styles.selCard,
                                { width: '48%', paddingVertical: 15, paddingHorizontal: 12, height: 60, marginBottom: 0 },
                                details.crop_type === c.id && { backgroundColor: COLORS.paleGreen, borderColor: COLORS.forest + '80' }
                            ]}
                        >
                            <Text style={{ fontSize: 22, marginRight: 10 }}>{c.icon}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: details.crop_type === c.id ? COLORS.forest : COLORS.darkEarth, flex: 1 }} numberOfLines={1}>
                                {lang === 'te' ? c.te : (lang === 'hi' ? c.hi : c.en)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Soil Type Pills */}
                <Lbl style={{ color: COLORS.warmGray, fontSize: 13, marginBottom: 15 }}>
                    {lang === 'te' ? 'నేల రకం' : (lang === 'hi' ? 'मिट्टी का प्रकार' : 'SOIL TYPE')}
                </Lbl>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 }}>
                    {SOIL_TYPES.map(s => (
                        <TouchableOpacity
                            key={s.id}
                            onPress={() => update('soil_type', s.id)}
                            style={[
                                styles.pill,
                                { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
                                details.soil_type === s.id && { backgroundColor: COLORS.paleGreen, borderColor: COLORS.forest + '80' }
                            ]}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '700', color: details.soil_type === s.id ? COLORS.forest : COLORS.warmGray }}>
                                {lang === 'te' ? s.te : (lang === 'hi' ? s.hi : s.en)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sowing Date */}
                <Lbl style={{ color: COLORS.warmGray, fontSize: 13, marginBottom: 15 }}>
                    {lang === 'te' ? 'విత్తిన తేదీ' : (lang === 'hi' ? 'बुवाई की तारीख' : 'SOWING DATE')}
                </Lbl>
                <Pressable
                    onPress={() => setShowPicker(true)}
                    style={{
                        backgroundColor: COLORS.cream + '40',
                        borderWidth: 1,
                        borderColor: COLORS.lightGray + '40',
                        borderRadius: 16,
                        height: 60,
                        justifyContent: 'center',
                        paddingHorizontal: 20,
                        marginBottom: 30
                    }}
                >
                    <Text style={{ fontSize: 16, color: details.date ? COLORS.darkEarth : COLORS.warmGray, fontWeight: '600' }}>
                        {details.date || 'YYYY-MM-DD'}
                    </Text>
                </Pressable>

                {showPicker && (
                    <DateTimePicker
                        value={details.date ? new Date(details.date) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}

                {/* Irrigation Selection */}
                <Lbl style={{ color: COLORS.warmGray, fontSize: 13, marginBottom: 15 }}>
                    {lang === 'te' ? 'నీటి పారుదల' : (lang === 'hi' ? 'సిंचाई' : 'IRRIGATION')}
                </Lbl>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 20 }}>
                    {IRRIGATION.map(i => (
                        <TouchableOpacity
                            key={i.id}
                            onPress={() => update('irrigation', i.id)}
                            activeOpacity={0.8}
                            style={[
                                styles.selCard,
                                { width: '48%', paddingVertical: 15, paddingHorizontal: 12, height: 60, marginBottom: 0 },
                                details.irrigation === i.id && { backgroundColor: COLORS.paleGreen, borderColor: COLORS.forest + '80' }
                            ]}
                        >
                            <Text style={{ fontSize: 22, marginRight: 10 }}>{i.icon}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: details.irrigation === i.id ? COLORS.forest : COLORS.darkEarth, flex: 1 }} numberOfLines={1}>
                                {lang === 'te' ? i.te : (lang === 'hi' ? i.hi : i.en)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Btn
                    onClick={handleNext}
                    disabled={!details.crop_type || !details.soil_type}
                    style={{ marginTop: 20, height: 60, borderRadius: 30, backgroundColor: (details.crop_type && details.soil_type) ? COLORS.forest : COLORS.forest + '40' }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>{lang === 'te' ? 'తదుపరి ' : (lang === 'hi' ? 'अगला ' : 'Next ')}</Text>
                        <MaterialCommunityIcons name="arrow-right-thick" size={20} color="white" style={{ marginLeft: 6 }} />
                    </View>
                </Btn>
            </ScrollView>
        </View>
    );
};
