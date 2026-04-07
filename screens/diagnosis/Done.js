import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Btn } from '../../components/Shared';
import { styles } from './styles';

export const S13b_Done = ({ onNext, onBack, lang, theme }) => {
    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.subTabHeader, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}><MaterialCommunityIcons name="arrow-left-thick" size={24} color="white" /></TouchableOpacity>
                <View style={styles.subTab}><Text style={styles.subTabText}>{lang === 'hi' ? 'कार्य' : (lang === 'te' ? 'టాస్క్' : 'Task')}</Text></View>
                <View style={styles.subTab}><Text style={styles.subTabText}>{lang === 'hi' ? 'फोटो' : (lang === 'te' ? 'ఫోటో' : 'Photo')}</Text></View>
                <View style={[styles.subTab, styles.subTabAct]}><Text style={styles.subTabTextAct}>{lang === 'hi' ? 'संपन्न' : (lang === 'te' ? 'పూర్తి' : 'Done')}</Text></View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                    <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <MaterialCommunityIcons name="check-decagram" size={64} color="#388E3C" />
                    </View>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: theme.text, marginBottom: 12 }}>{lang === 'te' ? 'సమర్పించబడింది!' : (lang === 'hi' ? 'सबमिट किया गया!' : 'Submitted!')}</Text>
                    <Text style={styles.doneHeroSub}>
                        {lang === 'te' ? 'మీ ఫోటోలు అప్లోడ్ చేయబడ్డాయి.\nAI విశ్లేషణ ప్రారంభమవుతోంది.' : (lang === 'hi' ? 'आपकी तस्वीरें अपलोड कर दी गई हैं।\nएआई विश्लेषण अब शुरू हो रहा है।' : 'Photos uploaded successfully.\nAI analysis is now starting.')}
                    </Text>
                </View>

                <View style={{ padding: 20, paddingTop: 24 }}>
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                        <View style={[styles.doneStatCard, { backgroundColor: theme.card, borderColor: theme.border, flex: 1 }]}>
                            <Text style={{ fontSize: 22 }}>🔬</Text>
                            <Text style={[styles.doneStatVal, { color: '#388E3C' }]}>AI</Text>
                            <Text style={[styles.doneStatLabel, { color: '#388E3C', fontWeight: '800' }]}>{lang === 'te' ? 'విశ్లేషణ' : (lang === 'hi' ? 'विश्लेषण...' : 'Analyzing...')}</Text>
                        </View>
                        <View style={[styles.doneStatCard, { backgroundColor: theme.card, borderColor: theme.border, flex: 1 }]}>
                            <Text style={{ fontSize: 22 }}>⏱️</Text>
                            <Text style={[styles.doneStatVal, { color: theme.text }]}>4-6h</Text>
                            <Text style={[styles.doneStatLabel, { color: theme.subText }]}>{lang === 'te' ? 'సమయం' : (lang === 'hi' ? 'समय' : 'ETA')}</Text>
                        </View>
                        <View style={[styles.doneStatCard, { backgroundColor: theme.card, borderColor: theme.border, flex: 1 }]}>
                            <Text style={{ fontSize: 22 }}>📸</Text>
                            <Text style={[styles.doneStatVal, { color: theme.primary }]}>3</Text>
                            <Text style={[styles.doneStatLabel, { color: theme.subText }]}>{lang === 'te' ? 'అప్లోడ్' : (lang === 'hi' ? 'अपलोड' : 'Uploaded')}</Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionLabelSmall, { color: theme.subText, marginBottom: 12 }]}>{lang === 'te' ? 'తదుపరి ఏమి జరుగుతుంది' : (lang === 'hi' ? 'आगे क्या होगा' : 'WHAT HAPPENS NEXT')}</Text>
                    {[
                        { icon: 'satellite-uplink', title: lang === 'te' ? 'సాటిలైట్ డేటాతో సరిపోల్చబడుతుంది' : (lang === 'hi' ? 'सैटेलाइट डेटा के साथ मिलान' : 'Cross-referenced with satellite data'), sub: lang === 'te' ? 'Sentinel-2 NDVI + NDWI పోల్చబడుతోంది' : (lang === 'hi' ? 'Sentinel-2 NDVI और NDWI परतों का मिलान' : 'Sentinel-2 NDVI & NDWI layers matched'), color: '#1565C0', bg: '#E3F2FD' },
                        { icon: 'brain', title: lang === 'te' ? 'AI నమూనా విశ్లేషిస్తోంది' : (lang === 'hi' ? 'एआई मॉडल विश्लेषण कर रहा है' : 'AI model is analysing patterns'), sub: lang === 'te' ? 'సంభావ్య కారణాలు గుర్తించబడుతున్నాయి' : (lang === 'hi' ? 'संभावित कारणों की पहचान की जा रही है' : 'Possible causes are being identified'), color: '#6A1B9A', bg: '#F3E5F5' },
                        { icon: 'flask-outline', title: lang === 'te' ? 'నివేదిక సిద్ధమవుతోంది' : (lang === 'hi' ? 'रिपोर्ट तैयार की जा रही है' : 'Report being prepared'), sub: lang === 'te' ? 'మీకు నోటిఫికేషన్ వస్తుంది' : (lang === 'hi' ? 'तैयार होने पर आपको सूचित किया जाएगा' : 'You will be notified once it\'s ready'), color: '#2E7D32', bg: '#E8F5E9' },
                    ].map((step, i) => (
                        <View key={i} style={[styles.doneNextCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <View style={[styles.doneNextIcon, { backgroundColor: step.bg }]}>
                                <MaterialCommunityIcons name={step.icon} size={20} color={step.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 2 }}>{step.title}</Text>
                                <Text style={{ fontSize: 11, color: theme.subText, lineHeight: 15 }}>{step.sub}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.btmBar, { borderTopColor: theme.border }]}>
                <Btn theme={theme} onClick={onNext} variant="primary">
                    {lang === 'te' ? 'విశ్లేషణ స్థితిని తనిఖీ చేయండి' : (lang === 'hi' ? 'विश्लेषण स्थिति जांचें' : 'Check Analysis Status')}
                    <MaterialCommunityIcons name="arrow-right-thick" size={20} color="white" style={{ marginLeft: 8 }} />
                </Btn>
            </View>
        </View>
    );
};
