import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { useLocalization } from './LocalizationContext';
import Svg, { Polygon as SvgPolygon, Circle as SvgCircle, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import { LEAFLET_JS } from '../assets/leaflet_dist';
import { LEAFLET_CSS } from '../assets/leaflet_css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Common Header Text
 */
export const Hdr = ({ children, style, invert, sub, onBack, onClose, theme }) => (
    <View style={[styles.hdrContainer, style]}>
        {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtnSmall}>
                <MaterialCommunityIcons
                    name="arrow-left-thick"
                    size={26}
                    color={invert ? COLORS.white : (theme ? theme.primary : COLORS.forest)}
                />
            </TouchableOpacity>
        )}
        {!onBack && <View style={{ width: 40 }} />}

        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.hdr, { color: invert ? COLORS.white : (theme ? theme.text : COLORS.deepOlive) }]}>
                {children}
            </Text>
            {sub && <Text style={[styles.hdrSub, theme && { color: theme.subText }]}>{sub}</Text>}
        </View>

        {onClose ? (
            <TouchableOpacity onPress={onClose} style={styles.backBtnSmall}>
                <MaterialCommunityIcons
                    name="close"
                    size={28}
                    color={invert ? COLORS.white : (theme ? theme.primary : COLORS.forest)}
                />
            </TouchableOpacity>
        ) : (
            <View style={{ width: 40 }} />
        )}
    </View>
);

/**
 * Common Label/Subtext
 */
export const Lbl = ({ children, style, color, theme }) => (
    <Text style={[styles.lbl, { color: color || (theme ? theme.subText : COLORS.warmGray) }, style]}>
        {children}
    </Text>
);

/**
 * Card Container with Shadow
 */
export const Card = ({ children, style, theme }) => (
    <View style={[
        styles.card,
        theme && { backgroundColor: theme.card, borderColor: theme.border },
        style
    ]}>
        {children}
    </View>
);

/**
 * Primary Action Button
 */
export const Btn = ({ children, onClick, disabled, variant = 'primary', style, theme }) => {
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';

    let btnStyle = isSecondary ? (theme ? { backgroundColor: theme.surface, borderWidth: 1.5, borderColor: theme.primary + '40' } : styles.btnSecondary) : (theme ? { backgroundColor: theme.primary } : styles.btnPrimary);
    if (isOutline) {
        btnStyle = { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme ? theme.primary : COLORS.forest };
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClick}
            disabled={disabled}
            style={[
                styles.btn,
                btnStyle,
                disabled && { opacity: 0.5 },
                style
            ]}
        >
            <Text style={[styles.btnText, { color: isOutline || isSecondary ? (theme ? theme.primary : COLORS.forest) : COLORS.white }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

/**
 * Native Text Input
 */
export const Input = ({ value, onChange, placeholder, keyboardType, secureTextEntry, style, theme }) => (
    <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme ? theme.subText + '70' : COLORS.lightGray}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[
            styles.input,
            theme && { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
            style
        ]}
    />
);

/**
 * Native Canvas for Field Boundaries & Heatmaps
 */
export const FieldHeatmap = ({ points, userPos, stressPoint, stressPoints, selectedIdx = 0, width = 300, height = 200, theme, mini, status, showMap = true }) => {
    const primaryColor = theme ? theme.primary : COLORS.forest;
    const backgroundOverlay = theme ? theme.background : COLORS.warmWhite;

    const validPoints = (points || [])
        .map(p => Array.isArray(p) ? { latitude: p[0], longitude: p[1] } : (p.latitude ? p : { latitude: p.x, longitude: p.y }))
        .filter(p => p && typeof p.latitude === 'number' && typeof p.longitude === 'number' && !isNaN(p.latitude) && !isNaN(p.longitude));

    if (validPoints.length < 2) {
        return <View style={{ width, height, backgroundColor: COLORS.lightGray + '20', borderRadius: 16 }} />;
    }

    // For OSM / Real Map
    if (showMap) {
        const leafHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <style>
                    ${LEAFLET_CSS}
                    body { margin: 0; padding: 0; overflow: hidden; background: #fff; }
                    #map { height: 100vh; width: 100vw; }
                    .leaflet-control-attribution { display: none; }
                </style>
                <script>${LEAFLET_JS}</script>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    var points = ${JSON.stringify(validPoints.map(p => [p.latitude || p.lat, p.longitude || p.lng]))};
                    var map = L.map('map', { 
                        zoomControl: false, 
                        attributionControl: false,
                        dragging: ${!mini}, 
                        touchZoom: ${!mini}, 
                        scrollWheelZoom: ${!mini},
                        doubleClickZoom: ${!mini}
                    });
                    
                    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                        maxZoom: 19
                    }).addTo(map);

                    var poly = L.polygon(points, { color: '#00cc00', fillColor: '#00cc00', fillOpacity: 0.3, weight: 2 }).addTo(map);
                    map.fitBounds(poly.getBounds(), { padding: [10, 10] });

                    // Stress Points Logic (New Array Support)
                    var spts = ${JSON.stringify(stressPoints || (stressPoint ? [stressPoint] : []))};
                    var selIdx = ${selectedIdx};

                    spts.forEach(function(sp, i) {
                        var coords = Array.isArray(sp) ? sp : [sp.latitude || sp.lat || sp.x, sp.longitude || sp.lng || sp.y];
                        var isActive = i === selIdx;
                        
                        // Circle Marker
                        L.circleMarker(coords, { 
                            radius: isActive ? 8 : 5, 
                            color: isActive ? '#ff453a' : '#ff9f0a', 
                            fillColor: isActive ? '#ff453a' : '#ff9f0a', 
                            fillOpacity: 0.8, 
                            weight: isActive ? 4 : 2 
                        }).addTo(map);

                        // Label Icon
                        var labelIcon = L.divIcon({
                            className: 'custom-div-icon',
                            html: "<div style='background-color: white; color: black; border: 1px solid black; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; position: absolute; top: -20px; left: -8px;'>" + (i + 1) + "</div>",
                            iconSize: [0, 0]
                        });
                        L.marker(coords, { icon: labelIcon }).addTo(map);

                        if (isActive && spts.length > 1) {
                            map.setView(coords, map.getZoom());
                        }
                    });

                    ${userPos ? `
                        var up = ${JSON.stringify(Array.isArray(userPos) ? userPos : [userPos.latitude || userPos.lat || userPos.x, userPos.longitude || userPos.lng || userPos.y])};
                        L.circleMarker(up, { radius: 4, color: '#007aff', fillColor: '#007aff', fillOpacity: 1, weight: 2 }).addTo(map);
                    ` : ''}
                </script>
            </body>
            </html>
        `;

        return (
            <View style={{ width, height, borderRadius: 20, overflow: 'hidden', backgroundColor: COLORS.lightGray + '10' }}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: leafHTML }}
                    style={{ flex: 1 }}
                    scrollEnabled={!mini}
                />
            </View>
        );
    }

    // Legacy SVG mode (fallback)
    const minX = Math.min(...validPoints.map(p => p.latitude));
    const maxX = Math.max(...validPoints.map(p => p.latitude));
    const minY = Math.min(...validPoints.map(p => p.longitude));
    const maxY = Math.max(...validPoints.map(p => p.longitude));

    const centroidX = validPoints.reduce((s, p) => s + p.latitude, 0) / validPoints.length;
    const centroidY = validPoints.reduce((s, p) => s + p.longitude, 0) / validPoints.length;
    const sortedPoints = [...validPoints].sort((a, b) => {
        return Math.atan2(a.longitude - centroidY, a.latitude - centroidX) - Math.atan2(b.longitude - centroidY, b.latitude - centroidX);
    });

    const rangeX = maxX - minX || 0.0001;
    const rangeY = maxY - minY || 0.0001;
    const padding = mini ? 10 : 40;

    const scaleX = (val) => padding + (val - minX) / rangeX * (width - 2 * padding);
    const scaleY = (val) => padding + (val - minY) / rangeY * (height - 2 * padding);

    const scaledPaths = sortedPoints.map(p => `${scaleX(p.latitude)},${scaleY(p.longitude)}`).join(' ');

    return (
        <View style={{ width, height, backgroundColor: backgroundOverlay, borderRadius: 16, overflow: 'hidden', alignSelf: 'center' }}>
            <Svg width={width} height={height}>
                <SvgPolygon
                    points={scaledPaths}
                    fill={primaryColor + '60'}
                    stroke={COLORS.lime}
                    strokeWidth="2"
                />
            </Svg>
        </View>
    );
};

/**
 * Step Tracker / Progress Bar
 */
export const StepTracker = ({ currentStep = 0, theme }) => {
    const { t } = useLocalization();
    const steps = [
        t('stepOnboarding') || 'ONBOARDING',
        t('stepDashboard') || 'DASHBOARD',
        t('stepAlertNav') || 'ALERT & NAV',
        t('stepInspection') || 'INSPECTION',
        t('stepDiagnosis') || 'DIAGNOSIS'
    ];
    const primaryColor = theme ? theme.primary : COLORS.forest;

    return (
        <View style={{ height: 32, backgroundColor: primaryColor, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
            {steps.map((s, i) => (
                <View key={i} style={{ flex: 1, height: '100%', justifyContent: 'center' }}>
                    <Text style={{
                        fontSize: 8,
                        fontWeight: '800',
                        color: i === currentStep ? COLORS.white : COLORS.white + '40',
                        textAlign: 'center'
                    }}>
                        {s}
                    </Text>
                    {i === currentStep && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: COLORS.lime }} />}
                </View>
            ))}
        </View>
    );
};

/**
 * Common Bottom Navigation Bar
 */
export const BottomNav = ({ activeIdx, goTo, theme }) => {
    const { t } = useLocalization();
    const tabs = [
        { id: 'home', icon: 'home', label: t('home') || 'Home', idx: 7 },
        { id: 'alerts', icon: 'bell', label: t('alerts') || 'Alerts', idx: 22 },
        { id: 'dis', icon: 'magnify-scan', label: t('diagnosis') || 'Analysis', idx: 10 },
        { id: 'pro', icon: 'account', label: t('profile') || 'Profile', idx: 18 },
    ];

    const isTabActive = (tabIdx) => {
        if (tabIdx === 7) return activeIdx === 7 || activeIdx === 8;
        if (tabIdx === 22) return activeIdx === 22 || activeIdx === 9;
        if (tabIdx === 10) return (activeIdx >= 10 && activeIdx <= 17) || activeIdx >= 23;
        if (tabIdx === 18) return activeIdx >= 18 && activeIdx <= 21;
        return activeIdx === tabIdx;
    };

    return (
        <View style={[styles.bottomNav, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
            {tabs.map((tab) => {
                const active = isTabActive(tab.idx);
                return (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => goTo(tab.idx)}
                        style={styles.navItem}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name={active ? tab.icon : `${tab.icon}-outline`}
                            size={24}
                            color={active ? theme.primary : theme.subText}
                        />
                        <Text style={[styles.navLabel, { color: active ? theme.primary : theme.subText }]}>
                            {tab.label}
                        </Text>
                        {active && <View style={[styles.navIndicator, { backgroundColor: theme.primary }]} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    hdrContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    backBtnSmall: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hdr: {
        fontSize: 24,
        fontWeight: TYPOGRAPHY.weights.black,
        textAlign: 'center',
        color: COLORS.deepOlive,
    },
    hdrSub: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.warmGray,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    lbl: {
        fontSize: 12,
        fontWeight: TYPOGRAPHY.weights.semiBold,
        color: COLORS.warmGray,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    card: {
        backgroundColor: COLORS.cream,
        borderRadius: 16,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.lightGray + '40',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    btn: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: COLORS.forest,
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    btnPrimary: {
        backgroundColor: COLORS.forest,
    },
    btnSecondary: {
        backgroundColor: COLORS.paleGreen,
        borderWidth: 1.5,
        borderColor: COLORS.forest + '30',
    },
    btnText: {
        fontSize: 15,
        fontWeight: TYPOGRAPHY.weights.bold,
    },
    input: {
        width: '100%',
        height: 56,
        backgroundColor: COLORS.cream,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
        paddingHorizontal: 20,
        fontSize: 16,
        color: COLORS.darkEarth,
        marginBottom: 20,
    },
    bottomNav: {
        flexDirection: 'row',
        height: 70,
        borderTopWidth: 1,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingTop: 10,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 4,
    },
    navIndicator: {
        position: 'absolute',
        top: -10,
        width: 24,
        height: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    }
});
