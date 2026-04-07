import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
    full: { flex: 1 },
    hdrRow: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
    hdrTitleSmall: { fontSize: 18, fontWeight: '800', color: 'white', marginLeft: 12 },
    loaderBox: { height: 250, alignItems: 'center', justifyContent: 'center' },
    stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14, paddingHorizontal: 30 },
    stepDot: { width: 10, height: 10, borderRadius: 5 },
    stepText: { fontSize: 14, fontWeight: '600' },
    scrollContent: { padding: 16, paddingBottom: 110 },

    // Summary Styles
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 20,
    },
    summaryItem: {
        width: '50%',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    summaryVal: {
        fontSize: 13,
        fontWeight: '900',
    },

    // Health Styles
    healthGrid: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 10,
    },
    healthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    healthDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    healthLabel: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
    },
    healthVal: {
        fontSize: 15,
        fontWeight: '900',
    },

    // Warning Styles
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    warningText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#D84315',
        lineHeight: 16,
    },

    // Result Card Styles
    resultCard: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    severityBadgeSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    resultDataRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultDataLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    resultDataValue: {
        fontSize: 12,
        fontWeight: '800',
    },

    resCard: { padding: 20, marginBottom: 20, borderRadius: 20 },
    severityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    diagTitle: { fontSize: 18, fontWeight: '900', marginTop: 12 },
    diagDesc: { fontSize: 13, lineHeight: 20, marginTop: 8 },
    findingRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    findingText: { fontSize: 13, fontWeight: '600' },
    btmBar: { padding: 20, borderTopWidth: 1 },
    bullet: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
    stepItem: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    stepTextSmall: { fontSize: 13, lineHeight: 20 },

    // Unified Profile Styles
    topTabBar: { height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 20 },
    topTabItem: { height: '100%', justifyContent: 'center', paddingHorizontal: 4 },
    topTabItemAct: { borderBottomWidth: 3, borderBottomColor: COLORS.lime },
    topTabText: { fontSize: 12, fontWeight: '700' },
    topTabTextAct: { color: 'white' },
    avatarSilhoutte: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.lime },
    settingRowNew: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
    settingLabelText: { fontSize: 15, fontWeight: '700' },
    toggleNew: { width: 44, height: 24, borderRadius: 12, backgroundColor: COLORS.lightGray, padding: 3 },
    toggleOnNew: { backgroundColor: COLORS.forest },
    toggleCircleNew: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.white },
    logoutBtnLarge: { marginTop: 32, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    logoutBtnText: { fontWeight: '900', fontSize: 16 },
    langPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5 },
    langPillAct: { backgroundColor: COLORS.forest, borderColor: COLORS.forest },
    langPillText: { fontSize: 14, fontWeight: '700' },

    // Sub-tab Header Styles
    subTabHeader: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
    subTab: { height: '100%', justifyContent: 'center', paddingHorizontal: 4, borderBottomWidth: 3, borderBottomColor: 'transparent' },
    subTabAct: { borderBottomColor: 'white' },
    subTabText: { color: 'white', opacity: 0.6, fontSize: 13, fontWeight: '700' },
    subTabTextAct: { color: 'white', opacity: 1, fontSize: 13, fontWeight: '800' },

    // Check Card Styles (High Fidelity)
    checkCardNew: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.lightGray },
    checkboxNew: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    checkIcon: { color: 'white', fontSize: 12, fontWeight: '900' },
    checkTitleNew: { fontSize: 16, fontWeight: '800' },
    checkDescNew: { fontSize: 11, marginTop: 4, lineHeight: 16 },

    // Upload Row Styles
    uploadRow: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 20, marginBottom: 16, borderWidth: 1 },
    uploadIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    uploadTitle: { fontSize: 15, fontWeight: '900' },
    uploadDesc: { fontSize: 10, marginTop: 2 },
    sectionLabelSmall: { fontSize: 10, fontWeight: '800', marginBottom: 8, letterSpacing: 1 },
    logItemNew: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
    logIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    logTitleText: { fontSize: 14, fontWeight: '800' },
    logDateText: { fontSize: 10, marginTop: 2 },
    helpBigTitle: { fontSize: 24, fontWeight: '900', marginTop: 10 },
    helpSubTitle: { fontSize: 14, marginTop: 4 },
    faqRowNew: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
    faqTextNew: { fontSize: 14, fontWeight: '700' },
    custCareBtn: { marginTop: 30, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    custCareText: { color: 'white', fontWeight: '800', fontSize: 15 },
    editFieldLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.warmGray || '#888',
        letterSpacing: 0.8,
        marginBottom: 6,
        marginTop: 4,
    },

    // ── S13b_Done Premium Styles ──
    doneHero: {
        paddingTop: 48,
        paddingBottom: 36,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    doneRingOuter: {
        width: 116,
        height: 116,
        borderRadius: 58,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    doneRingInner: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    doneHeroTitle: { fontSize: 26, fontWeight: '900', color: 'white', marginBottom: 8 },
    doneHeroSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20 },
    doneStatCard: {
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        gap: 4,
    },
    doneStatVal: { fontSize: 18, fontWeight: '900' },
    doneStatLabel: { fontSize: 10, fontWeight: '700' },
    doneNextCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 10,
    },
    doneNextIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ── S11_Diagnosis Premium Styles ──
    diagHeroBanner: {
        padding: 20,
        paddingTop: 24,
        paddingBottom: 24,
        marginBottom: 4,
    },
    diagSeverityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    diagFindingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 10,
    },
    diagFindingNum: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
