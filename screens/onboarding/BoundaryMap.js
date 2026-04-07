import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../../theme';
import { LEAFLET_JS } from '../../assets/leaflet_dist';
import { LEAFLET_CSS } from '../../assets/leaflet_css';
import { Hdr, Lbl, Btn, Input } from '../../components/Shared';
import { styles } from './styles';

const calcArea = (points) => {
    if (!points || points.length < 3) return "0.0";
    const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
    const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
    const sorted = [...points].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
    let area = 0;
    for (let i = 0; i < sorted.length; i++) {
        let j = (i + 1) % sorted.length;
        area += sorted[i].x * sorted[j].y;
        area -= sorted[j].x * sorted[i].y;
    }
    const sqDegreeToAcres = 2900000;
    const result = (Math.abs(area) / 2) * sqDegreeToAcres;
    return result.toFixed(1);
};

export const S4_Boundary = ({ next, back, lang, details, setDetails, theme }) => {
    const [points, setPoints] = useState(details.coordinates?.map(c =>
        Array.isArray(c) ? { lat: c[0], lng: c[1] } : { lat: c.latitude, lng: c.longitude }
    ) || []);
    const [mapMode, setMapMode] = useState('satellite');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const webViewRef = useRef(null);

    const leafletHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <style>
                ${LEAFLET_CSS}
                body { margin: 0; padding: 0; overflow: hidden; background: #fff; }
                #map { height: 100vh; width: 100vw; }
                .marker-icon {
                    background: #2d5a27;
                    border: 2px solid white;
                    border-radius: 50%;
                    color: white;
                    font-weight: bold;
                    text-align: center;
                    line-height: 20px;
                    width: 24px;
                    height: 24px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.4);
                }
            </style>
            <script>${LEAFLET_JS}</script>
        </head>
        <body>
            <div id="map"></div>
            <script>
                var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([16.5062, 80.6480], 15);
                var satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    maxZoom: 20
                });
                var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19
                });
                satelliteLayer.addTo(map);
                var polygon = L.polygon([], { color: '#00ff00', fillColor: '#00ff0044', weight: 4 }).addTo(map);
                var markers = [];
                map.on('click', function(e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'click', latlng: e.latlng }));
                });
                function updateMarkers(points, locked) {
                    markers.forEach(m => map.removeLayer(m));
                    markers = points.map((p, i) => {
                        return L.marker(p, {
                            draggable: !locked,
                            icon: L.divIcon({
                                className: 'custom-icon',
                                html: '<div class="marker-icon">' + (i + 1) + '</div>',
                                iconSize: [24, 24],
                                iconAnchor: [12, 12]
                            })
                        }).addTo(map)
                        .on('dragend', function(e) {
                            if (locked) return;
                            var newPoints = markers.map(m => m.getLatLng());
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dragend', points: newPoints }));
                        });
                    });
                    polygon.setLatLngs(points);
                }
                function handleMessage(event) {
                    try {
                        var data = JSON.parse(event.data);
                        if (data.type === 'updatePoints') {
                            updateMarkers(data.points, data.locked);
                        } else if (data.type === 'setMode') {
                            if (data.mode === 'street') {
                                map.removeLayer(satelliteLayer);
                                streetLayer.addTo(map);
                            } else {
                                map.removeLayer(streetLayer);
                                satelliteLayer.addTo(map);
                            }
                        } else if (data.type === 'center') {
                            map.setView([data.lat, data.lng], 17);
                        } else if (data.type === 'fitBounds') {
                            const latlngs = polygon.getLatLngs();
                            if (latlngs.length > 0 && latlngs[0].length > 0) {
                                map.fitBounds(polygon.getBounds(), { padding: [50, 50] });
                            }
                        } else if (data.type === 'zoomIn') { map.zoomIn(); }
                        else if (data.type === 'zoomOut') { map.zoomOut(); }
                    } catch(e) {}
                }
                window.addEventListener('message', handleMessage);
                document.addEventListener('message', handleMessage);
            </script>
        </body>
        </html>
    `;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            let location = await Location.getCurrentPositionAsync({});
            webViewRef.current?.postMessage(JSON.stringify({ type: 'center', lat: location.coords.latitude, lng: location.coords.longitude }));
        })();
    }, []);

    useEffect(() => {
        webViewRef.current?.postMessage(JSON.stringify({ type: 'updatePoints', points: points, locked: isLocked }));
    }, [points, isLocked]);

    const handleMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'click' && points.length < 10 && !isLocked) {
            setPoints([...points, data.latlng]);
        } else if (data.type === 'dragend' && !isLocked) {
            setPoints(data.points);
        }
    };

    const [gpsLoading, setGpsLoading] = useState(false);

    const handleAddGpsPoint = async () => {
        if (isLocked || gpsLoading) return;
        if (points.length >= 10) {
            Alert.alert(lang === 'te' ? "గరిష్ట బిందువులు" : (lang === 'hi' ? "सीमा समाप्त" : "Limit Reached"), lang === 'te' ? "గరిష్టంగా 10 బిందువులను మాత్రమే గుర్తించగలరు." : (lang === 'hi' ? "आप अधिकतम 10 बिंदु ही चिह्नित कर सकते हैं।" : "You can only mark a maximum of 10 points."));
            return;
        }
        setGpsLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission denied", "Location permission is required to mark points.");
                return;
            }
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                maximumAge: 5000,
            });
            const newPoint = { lat: location.coords.latitude, lng: location.coords.longitude };
            const newPoints = [...points, newPoint];
            setPoints(newPoints);
            webViewRef.current?.postMessage(JSON.stringify({ type: 'center', lat: newPoint.lat, lng: newPoint.lng }));
        } catch (err) {
            Alert.alert("Error", "Could not get your current location. Please check your GPS settings.");
        } finally {
            setGpsLoading(false);
        }
    };

    const toggleMode = (mode) => {
        setMapMode(mode);
        webViewRef.current?.postMessage(JSON.stringify({ type: 'setMode', mode }));
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setIsSearching(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
            const resp = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm.trim())}&limit=1&addressdetails=0`,
                {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'KarshaFarmApp/1.0 (contact@karsha.app)',
                    }
                }
            );
            clearTimeout(timeout);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                webViewRef.current?.postMessage(JSON.stringify({ type: 'center', lat: parseFloat(lat), lng: parseFloat(lon) }));
            } else {
                Alert.alert(lang === 'te' ? "కనుగొనబడలేదు" : (lang === 'hi' ? "नहीं मिला" : "Not Found"), lang === 'te' ? "ఆ స్థానం కనుగొనబడలేదు." : (lang === 'hi' ? "वह स्थान नहीं मिल सका।" : "Could not find that location. Try a more specific name."));
            }
        } catch (e) {
            clearTimeout(timeout);
            if (e.name === 'AbortError') {
                Alert.alert(lang === 'te' ? "గడువు మించింది" : (lang === 'hi' ? "समय समाप्त" : "Timeout"), lang === 'te' ? "శోధన సమయం గడిచింది. మళ్ళీ ప్రయత్నించండి." : (lang === 'hi' ? "खोज का समय समाप्त हो गया।" : "Search timed out. Please try again."));
            } else {
                Alert.alert(lang === 'te' ? "లోపం" : (lang === 'hi' ? "त्रुटి" : "Error"), lang === 'te' ? "శోధన విఫలమైంది. నెట్‌వర్క్ తనిఖీ చేయండి." : (lang === 'hi' ? "खोज विफल रही।" : "Search failed. Please check your internet connection."));
            }
        } finally {
            setIsSearching(false);
        }
    };

    const area = calcArea(points.map(p => ({ x: p.lat, y: p.lng })));

    const [coords, setCoords] = useState(
        details.coordinates && details.coordinates.length > 0
            ? details.coordinates.map(c => ({
                lat: String(Array.isArray(c) ? c[0] : c.x || ''),
                lon: String(Array.isArray(c) ? c[1] : c.y || '')
            }))
            : [{ lat: '', lon: '' }, { lat: '', lon: '' }, { lat: '', lon: '' }]
    );

    const updateCoord = (idx, field, value) => {
        if (isLocked) return;
        const updated = [...coords];
        updated[idx] = { ...updated[idx], [field]: value };
        setCoords(updated);
    };

    const handlePlotCoords = () => {
        if (isLocked) return;
        const validCoords = coords.filter(c => c.lat && c.lon && !isNaN(Number(c.lat)) && !isNaN(Number(c.lon)));
        if (validCoords.length < 3) {
            Alert.alert(lang === 'te' ? "కనీసం 3 బిందువులు అవసరం" : (lang === 'hi' ? "न्यूनतम 3 बिंदुओं की आवश्यकता है" : "Min 3 points required"),
                lang === 'te' ? "దయచేసి కనీసం 3 సరైన బిందువులను నమోదు చేయండి." : (lang === 'hi' ? "कृपया कम से कम 3 सही बिंदु दर्ज करें।" : "Please enter at least 3 valid coordinate points."));
            return;
        }
        if (validCoords.length > 10) {
            Alert.alert(lang === 'te' ? "గరిష్టం 10 బిందువులు" : (lang === 'hi' ? "अधिकतम 10 बिंदुओं की अनुमति है" : "Max 10 points allowed"),
                lang === 'te' ? "మీరు గరిష్టంగా 10 బిందువులను మాత్రమే ప్లాట్ చేయవచ్చు." : (lang === 'hi' ? "आप केवल 10 बिंदुओं तक प्लॉट कर सकते हैं।" : "You can only plot up to 10 coordinate points."));
            return;
        }
        const newPoints = validCoords.map(c => ({ lat: Number(c.lat), lng: Number(c.lon) }));
        setPoints(newPoints);
        webViewRef.current?.postMessage(JSON.stringify({ type: 'updatePoints', points: newPoints }));
        setTimeout(() => {
            webViewRef.current?.postMessage(JSON.stringify({ type: 'fitBounds' }));
        }, 500);
    };

    const handleNext = () => {
        if (points.length >= 3) {
            const coordArray = points.map(p => [Number(p.lat), Number(p.lng)]);
            setDetails({ ...details, coordinates: coordArray, area: area });
            next();
        }
    };

    const addRow = () => {
        if (isLocked) return;
        if (coords.length < 10) setCoords([...coords, { lat: '', lon: '' }]);
    };

    const removeRow = (idx) => {
        if (isLocked) return;
        if (coords.length > 3) setCoords(coords.filter((_, i) => i !== idx));
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.full}>
            <Hdr onBack={back}>{lang === 'te' ? 'పొలం హద్దులు' : (lang === 'hi' ? 'खेत की सीमा' : 'Field Boundary')}</Hdr>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Lbl style={{ marginBottom: 8, color: COLORS.warmGray }}>DRAW FIELD BOUNDARY</Lbl>
                <View style={isFullScreen ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: 'white' } : { height: 380, marginHorizontal: 16, borderRadius: 28, overflow: 'hidden', backgroundColor: '#f0f0f0', marginBottom: 20, position: 'relative', borderWidth: 1, borderColor: COLORS.lightGray + '40' }}>
                    <WebView
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: leafletHtml }}
                        onMessage={handleMessage}
                        style={{ flex: 1 }}
                        onLoad={() => {
                            webViewRef.current?.postMessage(JSON.stringify({ type: 'updatePoints', points }));
                        }}
                    />
                    <View style={{ position: 'absolute', top: isFullScreen ? 50 : 12, left: 12, right: 12, flexDirection: 'row', gap: 8 }}>
                        <View style={{ flex: 1, backgroundColor: 'white', opacity: 0.95, borderRadius: 12, height: 46, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6 }}>
                            <MaterialCommunityIcons name="magnify" size={22} color={COLORS.forest} />
                            <TextInput
                                style={{ flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.darkEarth, fontWeight: '600' }}
                                placeholder={lang === 'te' ? "స్థానాన్ని వెతకండి..." : (lang === 'hi' ? "स्थान खोजें..." : "Search location...")}
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                onSubmitEditing={handleSearch}
                                editable={!isLocked}
                            />
                            {isSearching && <ActivityIndicator size="small" color={COLORS.forest} />}
                        </View>
                    </View>
                    <View style={{ position: 'absolute', top: isFullScreen ? 106 : 68, right: 12, gap: 12 }}>
                        <TouchableOpacity onPress={() => setIsFullScreen(!isFullScreen)} style={[styles.mapCtrlBtn, isFullScreen && { backgroundColor: COLORS.forest }]}>
                            <MaterialCommunityIcons name={isFullScreen ? "fullscreen-exit" : "fullscreen"} size={24} color={isFullScreen ? "white" : "#333"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => webViewRef.current?.postMessage(JSON.stringify({ type: 'zoomIn' }))} style={styles.mapCtrlBtn}>
                            <MaterialCommunityIcons name="plus" size={26} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => webViewRef.current?.postMessage(JSON.stringify({ type: 'zoomOut' }))} style={styles.mapCtrlBtn}>
                            <MaterialCommunityIcons name="minus" size={26} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAddGpsPoint} style={[styles.mapCtrlBtn, { backgroundColor: COLORS.paleGreen }]} disabled={isLocked}>
                            <MaterialCommunityIcons name="map-marker-plus" size={24} color={COLORS.forest} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleMode(mapMode === 'satellite' ? 'street' : 'satellite')} style={[styles.mapCtrlBtn, { backgroundColor: '#E1F5FE' }]}>
                            <MaterialCommunityIcons name="layers-outline" size={22} color="#0288D1" />
                        </TouchableOpacity>
                        {!isLocked && (
                            <>
                                <TouchableOpacity onPress={() => { if (points.length > 0) setPoints(points.slice(0, -1)); }} style={[styles.mapCtrlBtn, { backgroundColor: '#FFF3E0' }]}>
                                    <MaterialCommunityIcons name="undo-variant" size={22} color="#E65100" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    Alert.alert(lang === 'te' ? "అన్నీ క్లియర్" : (lang === 'hi' ? "सभी साफ़ करें" : "Clear All"), lang === 'te' ? "మీరు అన్ని పాయింట్లను తొలగించాలనుకుంటున్నారా?" : (lang === 'hi' ? "क्या आप वाकई सभी बिंदुओं को हटाना चाहते हैं?" : "Are you sure you want to clear all points?"),
                                        [{ text: lang === 'te' ? "కాదు" : (lang === 'hi' ? "नहीं" : "No"), style: "cancel" }, { text: lang === 'te' ? "అవును" : (lang === 'hi' ? "हाँ" : "Yes"), onPress: () => { setPoints([]); setIsLocked(false); } }]);
                                }} style={[styles.mapCtrlBtn, { backgroundColor: '#FFEBEE' }]}>
                                    <MaterialCommunityIcons name="trash-can-outline" size={22} color="#D32F2F" />
                                </TouchableOpacity>
                            </>
                        )}
                        {isLocked && (
                            <TouchableOpacity onPress={() => setIsLocked(false)} style={[styles.mapCtrlBtn, { backgroundColor: COLORS.paleGreen }]}>
                                <MaterialCommunityIcons name="pencil-outline" size={22} color={COLORS.forest} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                        <View style={{ padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.95)', elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <View>
                                <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.deepOlive, letterSpacing: 0.5 }}>{lang === 'te' ? 'బిందువులు' : (lang === 'hi' ? 'बिंदु' : 'POINTS')}: {points.length}/10</Text>
                                <Text style={{ fontSize: 10, color: COLORS.warmGray, marginTop: 2, fontWeight: '600' }}>{points.length < 3 ? (lang === 'te' ? 'కనీసం 3 అవసరం' : (lang === 'hi' ? 'कम से कम 3 आवश्यक' : 'Min 3 required')) : (lang === 'te' ? 'గరిష్టం 10 బిందువులు' : (lang === 'hi' ? 'अधिकतम 10 बिंदु' : 'Max 10 points'))}</Text>
                            </View>
                            {!isLocked && (
                                <TouchableOpacity onPress={handleAddGpsPoint} disabled={gpsLoading} style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.forest, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6, opacity: gpsLoading ? 0.6 : 1 }}>
                                    {gpsLoading ? <ActivityIndicator size="small" color={COLORS.forest} /> : <MaterialCommunityIcons name="crosshairs-gps" size={16} color={COLORS.forest} />}
                                    <Text style={{ color: COLORS.forest, fontWeight: '800', fontSize: 11 }}>{gpsLoading ? (lang === 'te' ? 'గుర్తిస్తోంది...' : (lang === 'hi' ? 'खोज रहा है...' : 'LOCATING...')) : (lang === 'te' ? '+ బిందువు జోడించు (GPS)' : (lang === 'hi' ? '+ बिंदु जोड़ें (GPS)' : '+ ADD POINT (GPS)'))}</Text>
                                </TouchableOpacity>
                            )}
                            {points.length > 0 && !isLocked && (
                                <TouchableOpacity onPress={() => { if (points.length < 3) { Alert.alert(lang === 'te' ? "కనీసం 3 బిందువులు అవసరం" : (lang === 'hi' ? "न्यूनतम 3 बिंदु" : "Min Points Required"), lang === 'te' ? "హద్దును గుర్తించడానికి కనీసం 3 బిందువులు అవసరం." : (lang === 'hi' ? "सीमा बनाने के लिए कम से कम 3 बिंदुओं की आवश्यकता है।" : "Minimum 3 points required to form a boundary.")); return; } setIsLocked(true); webViewRef.current?.postMessage(JSON.stringify({ type: 'updatePoints', points: points, locked: true })); Alert.alert(lang === 'te' ? "ముగిసింది" : (lang === 'hi' ? "लॉक किया गया" : "Locked"), lang === 'te' ? "పాయింట్లు లాక్ చేయబడ్డాయి." : (lang === 'hi' ? "बिंदु सफलतापूर्वक लॉक हो गए।" : "Points locked successfully.")); }} style={[{ backgroundColor: COLORS.forest, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 }, points.length < 3 && { opacity: 0.6 }]}>
                                    <MaterialCommunityIcons name="check-bold" size={16} color="white" />
                                    <Text style={{ color: 'white', fontWeight: '900', fontSize: 14 }}>{lang === 'te' ? 'పూర్తయింది' : (lang === 'hi' ? 'हो गया' : 'DONE')}</Text>
                                </TouchableOpacity>
                            )}
                            {isLocked && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.paleGreen, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                                        <MaterialCommunityIcons name="lock" size={14} color={COLORS.forest} />
                                        <Text style={{ color: COLORS.forest, fontWeight: '800', fontSize: 12 }}>{lang === 'hi' ? 'लॉक किया गया' : (lang === 'te' ? 'లాక్ చేయబడింది' : 'LOCKED')}</Text>
                                    </View>
                                    {isFullScreen && (
                                        <TouchableOpacity onPress={handleNext} style={{ backgroundColor: COLORS.forest, paddingHorizontal: 20, paddingVertical: 9, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6, elevation: 4 }}>
                                            <Text style={{ color: 'white', fontWeight: '900', fontSize: 14 }}>{lang === 'te' ? 'తదుపరి' : (lang === 'hi' ? 'अगला' : 'NEXT')}</Text>
                                            <MaterialCommunityIcons name="arrow-right-thick" size={16} color="white" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, marginTop: 12 }}>
                    <Lbl style={{ marginBottom: 0 }}>{lang === 'te' ? 'కోఆర్డినేట్లు నమోదు చేయండి' : (lang === 'hi' ? 'निर्देशांक दर्ज करें' : 'Enter Coordinates')}</Lbl>
                    <TouchableOpacity onPress={() => setCoords([{ lat: '', lon: '' }, { lat: '', lon: '' }, { lat: '', lon: '' }])} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.red + '10', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                        <MaterialCommunityIcons name="delete-sweep" size={16} color={COLORS.red} />
                        <Text style={{ color: COLORS.red, fontSize: 10, fontWeight: '800', marginLeft: 4 }}>{lang === 'te' ? 'అన్నీ క్లియర్' : (lang === 'hi' ? 'सभी साफ़ करें' : 'CLEAR ALL')}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 11, color: COLORS.warmGray, marginBottom: 12 }}>{lang === 'te' ? 'కనీసం 3, గరిష్టం 10 బిందువులు' : (lang === 'hi' ? 'न्यूनतम 3, अधिकतम 10 बिंदु (अक्षांश, देशांतर)' : 'Min 3, Max 10 points (Lat, Lon)')}</Text>
                {coords.map((c, i) => (
                    <View key={i} style={styles.coordRow}>
                        <View style={styles.coordNumBadge}><Text style={{ color: COLORS.white, fontSize: 11, fontWeight: '800' }}>{i + 1}</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.coordLabel}>{lang === 'te' ? 'అక్షాంశం' : (lang === 'hi' ? 'अक्षांश' : 'Latitude')}</Text>
                            <Input value={c.lat} onChange={v => updateCoord(i, 'lat', v)} placeholder="16.0864" keyboardType="decimal-pad" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.coordLabel}>{lang === 'te' ? 'రేఖాంశం' : (lang === 'hi' ? 'देशांतर' : 'Longitude')}</Text>
                            <Input value={c.lon} onChange={v => updateCoord(i, 'lon', v)} placeholder="80.9243" keyboardType="decimal-pad" />
                        </View>
                        {coords.length > 3 && (
                            <TouchableOpacity onPress={() => removeRow(i)} style={styles.removeBtn}><Text style={{ color: COLORS.red, fontSize: 18, fontWeight: '900' }}>×</Text></TouchableOpacity>
                        )}
                    </View>
                ))}
                {coords.length < 10 && (
                    <TouchableOpacity style={[styles.addCoordBtn, isLocked && { opacity: 0.5 }]} onPress={addRow} disabled={isLocked}>
                        <Text style={{ color: COLORS.forest, fontSize: 13, fontWeight: '800' }}>+ {lang === 'te' ? 'బిందువు జోడించు' : (lang === 'hi' ? 'बिंदु जोड़ें' : 'Add Point')}</Text>
                    </TouchableOpacity>
                )}
                <Btn onClick={() => { if (points.length < 3 && coords.filter(c => c.lat && c.lon).length >= 3) { handlePlotCoords(); } handleNext(); }} disabled={points.length < 3 && coords.filter(c => c.lat && c.lon).length < 3} style={{ marginTop: 24, backgroundColor: (points.length >= 3 || coords.filter(c => c.lat && c.lon).length >= 3) ? COLORS.forest : COLORS.warmGray }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: '900' }}>{lang === 'te' ? 'తదుపరి ' : (lang === 'hi' ? 'अगలా ' : 'Next ')}</Text>
                        <MaterialCommunityIcons name="arrow-right-thick" size={18} color="white" />
                    </View>
                </Btn>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
