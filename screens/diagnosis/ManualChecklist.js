import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Btn } from '../../components/Shared';
import { CROPS } from '../../constants';
import { styles } from './styles';

export const S10b_ManualChecklist = ({ onNext, onBack, lang, theme, field }) => {
    const crop = CROPS.find(c => c.id === field?.crop_type) || { icon: '🌱', en: field?.crop_type, te: field?.crop_type };
    const stepsList = [
        { id: 'leaf', te: 'ఆకు తనిఖీ', hi: 'पत्ती की जांच', en: 'Leaf Inspection', desc: 'Check the 3rd leaf from the top. Look for yellow/brown spots.', desc_te: 'పై నుండి 3వ ఆకును తనిఖీ చేయండి. పసుపు/గోధుమ రంగు మచ్చల కోసం చూడండి.', desc_hi: 'ऊपर से तीसरी पत्ती को जाँचें। पीले/भूरे धब्बों के लिए देखें।' },
        { id: 'stem', te: 'కాండం తనిఖీ', hi: 'तने की जांच', en: 'Stem Inspection', desc: 'Check the stem for black/brown marks or splits.', desc_te: 'నలుపు/గోధుమ రంగు గుర్తులు లేదా పగుళ్ల కోసం కాండాన్ని తనిఖీ చేయండి.', desc_hi: 'काले/भूरे निशानों या दरारों के लिए तने की जाँच करें।' },
        { id: 'soil', te: 'మట్టి / తేమ', hi: 'मिट्टी / नमी', en: 'Soil / Moisture', desc: 'Touch the soil around the plants. Is it dry or cracked?', desc_te: 'మొక్కల చుట్టూ ఉన్న మట్టిని తాకండి. అది ఎండిపోయిందా లేదా పగుళ్లు ఇచ్చిందా?', desc_hi: 'पौधों के चारों ओर की मिट्टी को छुएं। क्या यह सूखी है या फटी हुई है?' },
        { id: 'pest', te: 'పురుగుల గుర్తులు', hi: 'कीट के लक्षण', en: 'Pest Signs', desc: 'Look for insects or eggs under the leaves and on the stem.', desc_te: 'ఆకుల అడుగున మరియు కాండం మీద పురుగులు లేదా గుడ్ల కోసం చూడండి.', desc_hi: 'पत्तियों के नीचे और तने पर कीड़ों या अंडों की तलाश करें।' },
        { id: 'comp', te: 'పోలిక', hi: 'तुलना', en: 'Comparison', desc: 'Compare with nearby healthy plants.', desc_te: 'సమీపంలోని ఆరోగ్యకరమైన మొక్కలతో పోల్చండి.', desc_hi: 'पास के स्वस्थ पौधों के साथ तुलना करें।' },
    ];
    const [checks, setChecks] = useState({});
    const doneCount = Object.values(checks).filter(Boolean).length;
    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.subTabHeader, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}><MaterialCommunityIcons name="arrow-left-thick" size={24} color="white" /></TouchableOpacity>
                <View style={[styles.subTab, styles.subTabAct]}><Text style={styles.subTabTextAct}>{lang === 'hi' ? 'कार्य' : (lang === 'te' ? 'టాస్క్' : 'Task')}</Text></View>
                <View style={styles.subTab}><Text style={styles.subTabText}>{lang === 'hi' ? 'फोटो' : (lang === 'te' ? 'ఫోటో' : 'Photo')}</Text></View>
                <View style={styles.subTab}><Text style={styles.subTabText}>{lang === 'hi' ? 'संपन्न' : (lang === 'te' ? 'పూర్తి' : 'Done')}</Text></View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: theme.text }}>{field?.name || (lang === 'te' ? 'పొలం' : (lang === 'hi' ? 'खेत' : 'Field'))}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: theme.primary, marginTop: 2 }}>{crop.icon} {lang === 'te' ? crop.te : (lang === 'hi' ? crop.hi || crop.en : crop.en)}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: theme.primary }}>{doneCount}/{stepsList.length}</Text>
                </View>
                {stepsList.map(s => (
                    <TouchableOpacity key={s.id} onPress={() => setChecks({ ...checks, [s.id]: !checks[s.id] })} style={[styles.checkCardNew, { backgroundColor: theme.background, borderColor: theme.border }, checks[s.id] && { borderColor: theme.primary, backgroundColor: theme.primary + '08' }]}>
                        <View style={[styles.checkboxNew, { borderColor: theme.border }, checks[s.id] && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                            {checks[s.id] && <Text style={styles.checkIcon}>✓</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.checkTitleNew, { color: checks[s.id] ? theme.primary : theme.text }]}>{lang === 'te' ? s.te : (lang === 'hi' ? s.hi || s.en : s.en)}</Text>
                            <Text style={[styles.checkDescNew, { color: theme.subText }]}>{lang === 'te' ? s.desc_te || s.desc : (lang === 'hi' ? s.desc_hi || s.desc : s.desc)}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={[styles.btmBar, { borderTopColor: theme.border }]}>
                <Btn theme={theme} onClick={onNext} disabled={doneCount < 1}>
                    {doneCount < 1 ? (lang === 'te' ? 'కనీసం 1 అంశాన్ని ఎంచుకోండి' : (lang === 'hi' ? 'कम से कम 1 आइटम चुनें' : 'Select at least 1 item')) : (lang === 'te' ? 'తదుపరి దశ' : (lang === 'hi' ? 'अगला कदम' : 'Next Step'))}
                    {doneCount >= 1 && <MaterialCommunityIcons name="arrow-right-thick" size={18} color="white" style={{ marginLeft: 8 }} />}
                </Btn>
            </View>
        </View>
    );
};
