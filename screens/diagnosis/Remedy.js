import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Lbl, Btn, Card } from '../../components/Shared';
import { TRANSLATIONS } from '../../Translations';
import { styles } from './styles';

export const S12_Remedy = ({ onNext, onBack, onTabPress, analysisData, lang, theme }) => {
    const metrics = analysisData?.stress_points?.[0]?.metrics || {};

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.subTabHeader, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}><MaterialCommunityIcons name="arrow-left-thick" size={24} color="white" /></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('AI')} style={styles.subTab}><Text style={styles.subTabText}>AI</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Report')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'రిపోర్ట్' : (lang === 'hi' ? 'रिपोर्ट' : 'Report')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Remedy')} style={[styles.subTab, styles.subTabAct]}><Text style={styles.subTabTextAct}>{lang === 'te' ? 'పరిష్కారం' : (lang === 'hi' ? 'उपాయ' : 'Remedy')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Prog')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'స్టేటస్' : (lang === 'hi' ? 'ప్రగతి' : 'Prog')}</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Lbl theme={theme}>{lang === 'te' ? 'శాటిలైట్ సూచికలు' : (lang === 'hi' ? 'उपग्रह सूचकांक' : 'Satellite Indices')}</Lbl>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    {Object.entries(metrics).slice(0, 4).map(([k, v], i) => (
                        <Card theme={theme} key={i} style={{ width: '47%', padding: 12 }}>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: theme.primary }}>{k.toUpperCase()}</Text>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: theme.text, marginTop: 4 }}>
                                {typeof v === 'number' ? v.toFixed(3) : (v || '0.000')}
                            </Text>
                        </Card>
                    ))}
                </View>

                <Card theme={theme}>
                    <Lbl theme={theme}>{lang === 'te' ? 'అమలు చేయవలసిన పద్ధతులు' : (lang === 'hi' ? 'अनुसरण करने के चरण' : 'Steps to Follow')}</Lbl>
                    {(analysisData?.stress_points?.[0]?.possible_causes || []).map((s, i) => (
                        <View key={i} style={styles.stepItem}>
                            <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
                            <Text style={[styles.stepTextSmall, { color: theme.text }]}>
                                {lang === 'te' ? 'చర్య తీసుకోండి: ' : (lang === 'hi' ? 'कार्रवाई करें: ' : 'Take Action: ')} {TRANSLATIONS[lang][s] || s}
                            </Text>
                        </View>
                    ))}
                    {(!analysisData?.stress_points?.[0]?.possible_causes) && (
                        <Text style={[styles.stepTextSmall, { color: theme.text }]}>
                            {lang === 'te' ? 'పంట బాగుంది, ప్రత్యేక చర్యలు అవసరం లేదు.' : (lang === 'hi' ? 'फसल स्वस्थ है, किसी विशेष कार्रवाई की आवश्यकता नहीं है।' : 'Crop is healthy, no specific actions needed.')}
                        </Text>
                    )}
                </Card>
            </ScrollView>
            <View style={[styles.btmBar, { borderTopColor: theme.border }]}>
                <Btn theme={theme} onClick={onNext}>{lang === 'te' ? 'ప్రగతిని చూడండి' : (lang === 'hi' ? 'प्रगति देखें' : 'Track Progress')}</Btn>
            </View>
        </View>
    );
};
