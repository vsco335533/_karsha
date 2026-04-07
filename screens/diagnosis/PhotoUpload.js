import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Btn } from '../../components/Shared';
import { CROPS } from '../../constants';
import { styles } from './styles';

export const S11b_PhotoUpload = ({ onNext, onBack, lang, theme, field }) => {
    const crop = CROPS.find(c => c.id === field?.crop_type) || { icon: '🌱', en: field?.crop_type, te: field?.crop_type };
    const [uploads, setUploads] = useState({});
    const photoSlots = [
        { id: 'full', ic: '🌿', l: 'Full Plant', l_te: 'పూర్తి మొక్క', l_hi: 'पूरा पौधा', desc: 'Capture the entire plant from 2-3 feet away', desc_te: '2-3 అడుగుల దూరం నుండి మొక్క ఫోటో తీయండి', desc_hi: '2-3 फीट की दूरी से पूरे पौधे की फोटो लें' },
        { id: 'close', ic: '🍂', l: 'Leaf Close-up', l_te: 'ఆకు క్లోజప్', l_hi: 'पत्ती का क्लोज-अप', desc: 'Clear close-up photo of the affected leaf', desc_te: 'ప్రభావితమైన ఆకు స్పష్టమైన క్లోజప్ ఫోటో', desc_hi: 'प्रभावित पत्ती की स्पष्ट क्लोज-अप फोटो' },
        { id: 'soil', ic: '🕳️', l: 'Soil Condition', l_te: 'మట్టి పరిస్థితి', l_hi: 'मिट्टी की स्थिति', desc: 'Clear view of the soil around the plant', desc_te: 'మొక్క చుట్టూ ఉన్న మట్టి స్పష్టమైన ఫోటో', desc_hi: 'पौधे के चारों ओर की मिट्टी की स्पष्ट फोटो' },
        { id: 'wide', ic: '🌄', l: 'Wide View', l_te: 'వైడ్ వ్యూ', l_hi: 'वाइड व्यू', desc: 'Wide view showing the entire affected area', desc_te: 'మొత్తం ప్రభావిత ప్రాంతాన్ని చూపే వైడ్ ఫోటో', desc_hi: 'पूरे प्रभावित क्षेत्र को दिखाते हुए वाइड व्यू फोटो' },
    ];
    const uploadCount = Object.values(uploads).filter(Boolean).length;
    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.subTabHeader, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={onBack} style={{ paddingRight: 8 }}><MaterialCommunityIcons name="arrow-left-thick" size={24} color="white" /></TouchableOpacity>
                <View style={styles.subTab}><Text style={styles.subTabText}>{lang === 'hi' ? 'कार्य' : (lang === 'te' ? 'టాస్క్' : 'Task')}</Text></View>
                <View style={[styles.subTab, styles.subTabAct]}><Text style={styles.subTabTextAct}>{lang === 'hi' ? 'फोटो' : (lang === 'te' ? 'ఫోటో' : 'Photo')}</Text></View>
                <View style={styles.subTab}><Text style={styles.subTabText}>{lang === 'hi' ? 'संपन्न' : (lang === 'te' ? 'పూర్తి' : 'Done')}</Text></View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: theme.text }}>{field?.name || (lang === 'te' ? 'పొలం' : (lang === 'hi' ? 'खेत' : 'Field'))}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: theme.primary, marginTop: 2 }}>{crop.icon} {lang === 'te' ? crop.te : (lang === 'hi' ? crop.hi || crop.en : crop.en)}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: theme.primary }}>{uploadCount}/4</Text>
                </View>

                <View style={{ backgroundColor: theme.primary + '15', padding: 12, borderRadius: 12, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text>📸</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: theme.primary }}>{lang === 'te' ? 'కనీసం 1 ఫోటో అవసరం.' : (lang === 'hi' ? 'कम से कम 1 फोटो आवश्यक है।' : 'At least 1 photo required. Take clear photos.')}</Text>
                </View>

                {photoSlots.map(s => (
                    <TouchableOpacity key={s.id} style={[styles.uploadRow, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => setUploads({ ...uploads, [s.id]: true })}>
                        <View style={[styles.uploadIconBox, { backgroundColor: theme.surface }]}>
                            <Text style={{ fontSize: 24 }}>{s.ic}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.uploadTitle, { color: theme.text }]}>{lang === 'te' ? s.l_te : (lang === 'hi' ? s.l_hi : s.l)}</Text>
                            <Text style={[styles.uploadDesc, { color: theme.subText }]}>{lang === 'te' ? s.desc_te : (lang === 'hi' ? s.desc_hi : s.desc)}</Text>
                        </View>
                        {uploads[s.id] && <Text style={{ fontSize: 20, color: COLORS.lime }}>✅</Text>}
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={[styles.btmBar, { borderTopColor: theme.border }]}>
                <Btn theme={theme} onClick={onNext} disabled={uploadCount < 1}>
                    {uploadCount < 1 ? (lang === 'te' ? 'కనీసం 1 ఫోటోని అప్లోడ్ చేయండి' : (lang === 'hi' ? 'कम से कम 1 फोटो अपलोड करें' : 'Upload at least 1 photo')) : (lang === 'te' ? 'ఫోటోలను సమర్పించండి' : (lang === 'hi' ? 'फोटो जमा करें' : 'Submit Photos'))}
                </Btn>
            </View>
        </View>
    );
};
