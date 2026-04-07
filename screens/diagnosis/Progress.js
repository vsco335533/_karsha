import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Card, Lbl, Btn } from '../../components/Shared';
import { styles } from './styles';

export const S13_Progress = ({ onBack, onHome, onTabPress, lang, theme }) => {
    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.subTabHeader, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}><MaterialCommunityIcons name="arrow-left-thick" size={24} color="white" /></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('AI')} style={styles.subTab}><Text style={styles.subTabText}>AI</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Report')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'రిపోర్ట్' : (lang === 'hi' ? 'रिपोर्ट' : 'Report')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Remedy')} style={styles.subTab}><Text style={styles.subTabText}>{lang === 'te' ? 'పరిష్కారం' : (lang === 'hi' ? 'उपాయ' : 'Remedy')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => onTabPress?.('Prog')} style={[styles.subTab, styles.subTabAct]}><Text style={styles.subTabTextAct}>{lang === 'te' ? 'స్టేటస్' : (lang === 'hi' ? 'ప్రగతి' : 'Prog')}</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card theme={theme} style={{ backgroundColor: theme.primary + '08', borderWidth: 1.5, borderColor: theme.primary + '20' }}>
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 40, marginBottom: 10 }}>🌱</Text>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: theme.primary }}>
                            {lang === 'te' ? 'రికవరీ ప్రారంభం' : (lang === 'hi' ? 'रिकवरी शुरू हुई' : 'Recovery Initiated')}
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.subText, marginTop: 4, textAlign: 'center' }}>
                            {lang === 'te' ? 'చర్యలు పూర్తయినాయి • పర్యవేక్షణ కొనసాగుతోంది' : (lang === 'hi' ? 'कार्रवाई पूरी हुई • निगरानी सक्रिय है' : 'Actions completed • Monitoring active')}
                        </Text>
                    </View>
                </Card>
                <Card theme={theme} style={{ marginTop: 20 }}>
                    <Lbl theme={theme}>{lang === 'te' ? 'రికవరీ టైమ్లైన్' : (lang === 'hi' ? 'रिकवरी समयरेखा' : 'Recovery Timeline')}</Lbl>
                    {[
                        { day: lang === 'te' ? 'నేడు' : (lang === 'hi' ? 'आज' : 'Today'), label: lang === 'te' ? 'చర్యలు పూర్తి' : (lang === 'hi' ? 'कार्रवाई पूरी' : 'Actions Complete'), icon: '✅', done: true },
                        { day: lang === 'te' ? '3 రోజుల్లో' : (lang === 'hi' ? '3 दिनों में' : 'In 3 Days'), label: lang === 'te' ? 'రెండో నీటి పారుదల' : (lang === 'hi' ? 'दूसरी सिंचाई' : '2nd Irrigation'), icon: '💧', current: true },
                        { day: lang === 'te' ? '5 రోజుల్లో' : (lang === 'hi' ? '5 दिनों में' : 'In 5 Days'), label: lang === 'te' ? 'ఉపగ్రహ స్కాన్' : (lang === 'hi' ? 'सैटेलाइट स्कैन' : 'Satellite Scan'), icon: '🛰️' },
                        { day: lang === 'te' ? '14 రోజుల్లో' : (lang === 'hi' ? '14 दिनों में' : 'In 14 Days'), label: lang === 'te' ? 'పూర్తి రికవరీ' : (lang === 'hi' ? 'పూర్తి రికవరీ' : 'Full Recovery'), icon: '🌿' },
                    ].map((t, i) => (
                        <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 15, position: 'relative' }}>
                            {i < 3 && <View style={{ position: 'absolute', left: 13, top: 28, width: 2, height: 14, backgroundColor: t.done ? COLORS.lime : theme.border }} />}
                            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: t.done ? COLORS.lime + '20' : t.current ? COLORS.amber + '20' : theme.border + '30', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 14 }}>{t.done ? '✓' : t.icon}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: t.done || t.current ? theme.text : theme.subText }}>{t.label}</Text>
                                <Text style={{ fontSize: 11, color: theme.subText }}>{t.day}</Text>
                            </View>
                        </View>
                    ))}
                </Card>
            </ScrollView>
            <View style={{ padding: 20 }}>
                <Btn theme={theme} onClick={onHome}>{lang === 'te' ? 'హోమ్కి వెళ్ళండి 🏠' : (lang === 'hi' ? 'होम पर वापस जाएं 🏠' : 'Back to Home 🏠')}</Btn>
            </View>
        </View>
    );
};
