import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Card, Lbl, Btn, Hdr, Input } from '../../components/Shared';
import { BACKEND_URL } from '../../constants';
import { styles } from './styles';

/**
 * High-Fidelity Logs Content
 */
const ProfileLogs = ({ lang, theme }) => {
    const logItems = [
        { id: 1, title: lang === 'hi' ? 'सैटेलाइट स्कैन सफल रहा' : (lang === 'te' ? 'సాటిలైట్ స్కాన్ విజయవంతమైంది' : 'Satellite Scan Successful'), icon: '🛰️', bg: theme.primary + '20', date: "Mar 30 • 10:30 AM" },
        { id: 2, title: lang === 'hi' ? 'फोटो अपलोड किए गए' : (lang === 'te' ? 'ఫోటోలు అప్లోడ్ చేయబడ్డాయి' : 'Photos Uploaded'), icon: '📸', bg: COLORS.amber + '20', date: "Mar 29 • 04:15 PM" },
        { id: 3, title: lang === 'hi' ? 'तनाव अलर्ट' : (lang === 'te' ? 'ఒత్తిడి హెచ్చరిక' : 'Stress Alert'), icon: '⚠️', bg: COLORS.red + '20', date: "Mar 28 • 09:00 AM" },
        { id: 4, title: lang === 'hi' ? 'नया खेत जोड़ा गया' : (lang === 'te' ? 'కొత్త పొలం జోడించబడింది' : 'New Field Added'), icon: '📍', bg: theme.primary + '10', date: "Mar 20 • 11:20 AM" },
    ];
    return (
        <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}>
            <Hdr theme={theme} sub={lang === 'te' ? 'చరిత్ర' : (lang === 'hi' ? 'इतिहास' : 'History')}>{lang === 'hi' ? 'इतिहास और लॉग' : (lang === 'te' ? 'చరిత్ర మరియు లాగ్‌లు' : 'History & Logs')}</Hdr>
            {logItems.map(h => (
                <View key={h.id} style={[styles.logItemNew, { borderBottomColor: theme.border }]}>
                    <View style={[styles.logIconBox, { backgroundColor: h.bg }]}>
                        <Text style={{ fontSize: 18 }}>{h.icon}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                        <Text style={[styles.logTitleText, { color: theme.text }]}>{h.title}</Text>
                        <Text style={[styles.logDateText, { color: theme.subText }]}>{h.date}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

/**
 * High-Fidelity Help Content
 */
const ProfileHelp = ({ lang, theme }) => {
    const faqItems = [
        { q: lang === 'hi' ? "खेत की सीमाओं को कैसे बदलें?" : (lang === 'te' ? "పొలం సరిహద్దులను ఎలా మార్చాలి?" : "How to change field boundaries?") },
        { q: lang === 'hi' ? "NDVI क्या है?" : (lang === 'te' ? "NDVI అంటే ఏమిటి?" : "What is NDVI?") },
        { q: lang === 'hi' ? "अलर्ट कब आते हैं?" : (lang === 'te' ? "హెచ్చరికలు ఎప్పుడు వస్తాయి?" : "When do alerts arrive?") },
        { q: lang === 'hi' ? "सरकारी योजनाएं" : (lang === 'te' ? "ప్రభుత్వ పథకాలు" : "Government Schemes") },
    ];
    return (
        <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}>
            <Hdr theme={theme} sub={lang === 'te' ? 'సహాయం' : (lang === 'hi' ? 'सहायता' : 'Help')}>{lang === 'hi' ? 'सहायता और समर्थन' : (lang === 'te' ? 'సహాయం మరియు మద్దతు' : 'Help & Support')}</Hdr>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Text style={{ fontSize: 40 }}>🌵</Text>
                <Text style={[styles.helpBigTitle, { color: theme.primary }]}>{lang === 'hi' ? 'कर्शा सहायता केंद्र' : 'Karsha Help Center'}</Text>
                <Text style={[styles.helpSubTitle, { color: theme.subText }]}>{lang === 'hi' ? 'हम आपकी मदद के लिए यहां हैं' : 'We are here to help you'}</Text>
            </View>

            <Text style={[styles.sectionLabelSmall, { color: theme.subText }]}>{lang === 'hi' ? 'सामान्य प्रश्न' : 'COMMON QUESTIONS'}</Text>
            {faqItems.map((f, i) => (
                <TouchableOpacity key={i} style={[styles.faqRowNew, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.faqTextNew, { color: theme.text }]}>{f.q}</Text>
                    <Text style={{ color: theme.subText, fontSize: 18 }}>›</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={[styles.custCareBtn, { backgroundColor: theme.primary }]}>
                <Text style={styles.custCareText}>{lang === 'hi' ? 'कस्टमर केयर को कॉल करें' : 'Call Customer Care'} 📞</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export const S14_Profile = ({ onBack, profile, setProfile, lang, setLang, isDarkMode, setIsDarkMode, theme, onLogout, initialTab = 'Set' }) => {
    const [activeTab, setActiveTab] = useState(initialTab === 'Profile' ? 'Set' : initialTab);
    const [notifs, setNotifs] = useState(true);
    const [offlineMaps, setOfflineMaps] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editName, setEditName] = useState(profile?.name || '');
    const [editPhone, setEditPhone] = useState(profile?.phone || '');
    const [editVillage, setEditVillage] = useState(profile?.village || '');
    const [editMandal, setEditMandal] = useState(profile?.mandal || '');
    const [editDistrict, setEditDistrict] = useState(profile?.district || '');

    const handleSave = async () => {
        if (!editName.trim() || !editPhone.trim() || !editVillage.trim()) {
            Alert.alert(
                lang === 'te' ? 'అవసరమైన ఫీల్డ్‌లు' : 'Required Fields',
                lang === 'te' ? 'పేరు, ఫోన్, గ్రామం తప్పనిసరి.' : 'Name, Phone, and Village are required.'
            );
            return;
        }
        setIsSaving(true);
        try {
            const farmerId = profile?.id;
            if (farmerId) {
                const resp = await fetch(`${BACKEND_URL}/farmers/${farmerId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': '1' },
                    body: JSON.stringify({
                        name: editName.trim(), phone: editPhone.trim(), village: editVillage.trim(),
                        mandal: editMandal.trim() || null, district: editDistrict.trim() || null
                    }),
                });
                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    throw new Error(err?.detail || `HTTP ${resp.status}`);
                }
                const updated = await resp.json();
                setProfile({
                    ...profile, name: updated.name, phone: updated.phone, village: updated.village,
                    mandal: updated.mandal || '', district: updated.district || ''
                });
            } else {
                setProfile({
                    ...profile, name: editName.trim(), phone: editPhone.trim(), village: editVillage.trim(),
                    mandal: editMandal.trim(), district: editDistrict.trim()
                });
            }
            setIsEditing(false);
            Alert.alert(
                lang === 'te' ? 'విజయం ✓' : (lang === 'hi' ? 'सफल ✓' : 'Saved ✓'),
                lang === 'te' ? 'ప్రొఫైల్ అప్‌డేట్ చేయబడింది.' : (lang === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई।' : 'Profile updated successfully.')
            );
        } catch (e) {
            Alert.alert(
                lang === 'te' ? 'లోపం' : (lang === 'hi' ? 'त्रुटि' : 'Error'),
                lang === 'te' ? `సేవ్ చేయడం విఫలమైంది: ${e.message}` : (lang === 'hi' ? `प्रोफ़ाइल सेव नहीं की जा सकी: ${e.message}` : `Could not save profile: ${e.message}`)
            );
        } finally {
            setIsSaving(false);
        }
    };

    const renderProfileContent = () => (
        <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -12 }}>
                    <MaterialCommunityIcons name="arrow-left-thick" size={28} color={theme.primary} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', marginRight: 40 }}>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: theme.primary }}>{lang === 'te' ? 'ప్రొఫైల్ & సెట్టింగులు' : (lang === 'hi' ? 'प्रोफ़ाइल और सेटिंग्स' : 'Profile & Settings')}</Text>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: theme.subText, letterSpacing: 1 }}>{lang === 'te' ? 'సెట్టింగులు' : (lang === 'hi' ? 'सेटिंग्स' : 'SETTINGS')}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 16 }}>
                <View style={[styles.avatarSilhoutte, { backgroundColor: theme.surface }]}>
                    <Text style={{ fontSize: 32 }}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 22, fontWeight: '900', color: theme.text }}>{profile?.name || 'Farmer'}</Text>
                    <Text style={{ fontSize: 12, color: theme.subText, marginTop: 2 }}>
                        {[profile?.village, profile?.mandal, profile?.district].filter(Boolean).join(' • ') || '—'}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.subText }}>📞 {profile?.phone || '--'}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsEditing(true)} style={{ backgroundColor: theme.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 13 }}>{lang === 'te' ? 'మార్చు' : (lang === 'hi' ? 'बदलें' : 'Edit')}</Text>
                </TouchableOpacity>
            </View>

            {isEditing && (
                <Card theme={theme} style={{ marginBottom: 30, padding: 20 }}>
                    <Lbl theme={theme} style={{ marginBottom: 16 }}>{lang === 'te' ? 'ప్రొఫైల్ మార్చు' : (lang === 'hi' ? 'प्रोफ़ाइल बदलें' : 'EDIT PROFILE')}</Lbl>
                    <Text style={styles.editFieldLabel}>{lang === 'te' ? 'పేరు *' : (lang === 'hi' ? 'नाम *' : 'NAME *')}</Text>
                    <Input theme={theme} value={editName} onChange={setEditName} placeholder="e.g. Ramu Nayak" style={{ marginBottom: 12 }} />
                    <Text style={styles.editFieldLabel}>{lang === 'te' ? 'ఫోన్ నంబర్ *' : (lang === 'hi' ? 'फ़ोन नंबर *' : 'PHONE *')}</Text>
                    <Input theme={theme} value={editPhone} onChange={setEditPhone} placeholder="9876543210" keyboardType="phone-pad" style={{ marginBottom: 12 }} />
                    <Text style={styles.editFieldLabel}>{lang === 'te' ? 'గ్రామం *' : (lang === 'hi' ? 'గాँव *' : 'VILLAGE *')}</Text>
                    <Input theme={theme} value={editVillage} onChange={setEditVillage} placeholder="e.g. Kadiri" style={{ marginBottom: 12 }} />
                    <Text style={styles.editFieldLabel}>{lang === 'te' ? 'మండలం' : (lang === 'hi' ? 'मंडल' : 'MANDAL')}</Text>
                    <Input theme={theme} value={editMandal} onChange={setEditMandal} placeholder="e.g. Kadiri" style={{ marginBottom: 12 }} />
                    <Text style={styles.editFieldLabel}>{lang === 'te' ? 'జిల్లా' : (lang === 'hi' ? 'जिला' : 'DISTRICT')}</Text>
                    <Input theme={theme} value={editDistrict} onChange={setEditDistrict} placeholder="e.g. Sri Sathya Sai" style={{ marginBottom: 20 }} />
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Btn style={{ flex: 1 }} variant="secondary" theme={theme} onClick={() => setIsEditing(false)} disabled={isSaving}>{lang === 'te' ? 'రద్దు' : (lang === 'hi' ? 'रद्द करें' : 'Cancel')}</Btn>
                        <Btn style={{ flex: 1 }} theme={theme} onClick={handleSave} disabled={isSaving}>{isSaving ? <ActivityIndicator size="small" color="white" /> : (lang === 'te' ? 'సేవ్ చేయండి' : (lang === 'hi' ? 'सेव करें' : 'Save'))}</Btn>
                    </View>
                </Card>
            )}

            <Text style={[styles.sectionLabelSmall, { color: theme.subText }]}>{lang === 'te' ? 'యాప్ సెట్టింగులు' : (lang === 'hi' ? 'ऐप सेटिंग्स' : 'APP SETTINGS')}</Text>
            <View style={styles.settingRowNew}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 20 }}>🔔</Text>
                    <Text style={[styles.settingLabelText, { color: theme.text }]}>{lang === 'te' ? 'నోటిఫికేషన్లు' : (lang === 'hi' ? 'सूचनाएं' : 'Notifications')}</Text>
                </View>
                <TouchableOpacity onPress={() => setNotifs(!notifs)} style={[styles.toggleNew, notifs && styles.toggleOnNew]}><View style={[styles.toggleCircleNew, notifs && { transform: [{ translateX: 20 }] }]} /></TouchableOpacity>
            </View>
            <View style={styles.settingRowNew}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 20 }}>🌙</Text>
                    <Text style={[styles.settingLabelText, { color: theme.text }]}>{lang === 'te' ? 'డార్క్ మోడ్' : (lang === 'hi' ? 'डార్క్ మోడ్' : 'Dark Mode')}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={[styles.toggleNew, isDarkMode && styles.toggleOnNew]}><View style={[styles.toggleCircleNew, isDarkMode && { transform: [{ translateX: 20 }] }]} /></TouchableOpacity>
            </View>
            <View style={styles.settingRowNew}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 20 }}>🗺️</Text>
                    <Text style={[styles.settingLabelText, { color: theme.text }]}>{lang === 'te' ? 'ఆఫ్‌లైన్ మ్యాప్స్' : (lang === 'hi' ? 'ऑफ़लाइन मैप्स' : 'Offline Maps')}</Text>
                </View>
                <TouchableOpacity onPress={() => setOfflineMaps(!offlineMaps)} style={[styles.toggleNew, offlineMaps && styles.toggleOnNew]}><View style={[styles.toggleCircleNew, offlineMaps && { transform: [{ translateX: 20 }] }]} /></TouchableOpacity>
            </View>

            <View style={{ marginTop: 24 }}>
                <Text style={[styles.sectionLabelSmall, { color: theme.subText }]}>{lang === 'te' ? 'భాష' : (lang === 'hi' ? 'भाषा' : 'LANGUAGE')}</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                    <TouchableOpacity onPress={() => setLang('te')} style={[styles.langPill, lang === 'te' && styles.langPillAct]}><Text style={[styles.langPillText, lang === 'te' && { color: COLORS.white }]}>తెలుగు</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setLang('hi')} style={[styles.langPill, lang === 'hi' && styles.langPillAct]}><Text style={[styles.langPillText, lang === 'hi' && { color: COLORS.white }]}>हिन्दी</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setLang('en')} style={[styles.langPill, lang === 'en' && styles.langPillAct]}><Text style={[styles.langPillText, lang === 'en' && { color: COLORS.white }]}>English</Text></TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={[styles.logoutBtnLarge, { backgroundColor: theme.card }]} onPress={() => Alert.alert(lang === 'te' ? "లాగ్ అవుట్" : (lang === 'hi' ? "लॉग आउट" : "Log Out"), lang === 'te' ? "మీరు లాగ్ అవుట్ చేయాలనుకుంటున్నారా?" : (lang === 'hi' ? "क्या आप वाकई लॉग आउट करना चाहते हैं?" : "Are you sure you want to log out?"), [{ text: lang === 'te' ? "వద్దు" : (lang === 'hi' ? "रद्द करें" : "Cancel") }, { text: lang === 'te' ? "అవును" : (lang === 'hi' ? "लॉग అవుట్" : "Log Out"), style: 'destructive', onPress: onLogout }])}>
                <Text style={[styles.logoutBtnText, { color: COLORS.red }]}>{lang === 'te' ? 'లాగ్ అవుట్' : (lang === 'hi' ? 'लॉग అవుట్' : 'Log Out')}</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: 40, paddingBottom: 20 }}>
                <Text style={{ fontSize: 24 }}>🌵</Text>
                <Text style={{ fontSize: 10, fontWeight: '800', color: theme.subText, marginTop: 8, letterSpacing: 1 }}>KARSHA V1.0.4</Text>
            </View>
        </ScrollView>
    );

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.topTabBar, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => setActiveTab('Set')} style={[styles.topTabItem, activeTab === 'Set' && styles.topTabItemAct]}>
                    <Text style={[styles.topTabText, activeTab === 'Set' && styles.topTabTextAct]}>{lang === 'te' ? 'సెట్టింగ్స్' : (lang === 'hi' ? 'सेट' : 'Set')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Logs')} style={[styles.topTabItem, activeTab === 'Logs' && styles.topTabItemAct]}>
                    <Text style={[styles.topTabText, activeTab === 'Logs' && styles.topTabTextAct]}>{lang === 'te' ? 'లాగ్స్' : (lang === 'hi' ? 'लॉग' : 'Logs')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Help')} style={[styles.topTabItem, activeTab === 'Help' && styles.topTabItemAct]}>
                    <Text style={[styles.topTabText, activeTab === 'Help' && styles.topTabTextAct]}>{lang === 'te' ? 'సహాయం' : (lang === 'hi' ? 'सहायता' : 'Help')}</Text>
                </TouchableOpacity>
            </View>
            {activeTab === 'Set' && renderProfileContent()}
            {activeTab === 'Logs' && <ProfileLogs lang={lang} theme={theme} />}
            {activeTab === 'Help' && <ProfileHelp lang={lang} theme={theme} />}
        </View>
    );
};
