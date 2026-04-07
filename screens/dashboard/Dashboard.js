import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Platform, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Hdr, Card, Btn, FieldHeatmap } from '../../components/Shared';
import { BACKEND_URL, CROPS } from '../../constants';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const S6_Home = ({ onNext, goTo, lang, farmerId, farmerProfile, theme, idx }) => {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [selectedFarmId, setSelectedFarmId] = useState(null);

    useEffect(() => {
        if (farmerId || farmerProfile?.id) {
            loadFarms();
        }
    }, [farmerId, farmerProfile?.id, idx]);

    const loadFarms = () => {
        const id = farmerId || farmerProfile?.id;
        if (!id || id === 'undefined') return;
        setLoading(true);
        fetch(`${BACKEND_URL}/farmers/${id}/farms`, {
            headers: { "bypass-tunnel-reminder": "1" }
        })
            .then(res => res.json())
            .then(data => {
                setFarms(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // Fetch weather based on selection or first farm
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Determine coordinates (use selected farm, first farm, or fallback)
                let targetFarm = farms.find(f => f.id === selectedFarmId) || farms[0] || null;
                let lat = 14.1167, lon = 78.1667;
                if (targetFarm && targetFarm.coordinates && targetFarm.coordinates.length > 0) {
                    const c = targetFarm.coordinates[0];
                    lat = Array.isArray(c) ? c[0] : (c.x || c.lat || 14.1167);
                    lon = Array.isArray(c) ? c[1] : (c.y || c.lon || 78.1667);
                }

                // Initial weather data object
                let weatherData = {
                    temp: '--',
                    humidity: '--',
                    wind: '--',
                    icon: '🌤️',
                    location: targetFarm?.name || farmerProfile?.village || 'Kadiri',
                    desc: lang === 'te' ? 'డేటా లోడ్ అవుతోంది...' : (lang === 'hi' ? 'डेटा लोड हो रहा है...' : 'Fetching data...')
                };

                // Helper for timeout
                const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
                    return Promise.race([
                        fetch(url, options),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
                    ]);
                };

                // 1. Fetch Weather from Open-Meteo
                try {
                    const resp = await fetchWithTimeout(
                        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
                    );
                    const data = await resp.json();
                    if (data.current) {
                        const code = data.current.weather_code;
                        let icon = '☀️';
                        let desc = { en: 'Clear', te: 'నిర్మలంగా ఉంది', hi: 'साफ आसमान' };

                        if (code >= 80) { icon = '🌧️'; desc = { en: 'Rainy', te: 'వర్షం', hi: 'बारिश' }; }
                        else if (code >= 61) { icon = '🌧️'; desc = { en: 'Rainy', te: 'వర్షం', hi: 'बारिश' }; }
                        else if (code >= 51) { icon = '🌦️'; desc = { en: 'Drizzle', te: 'తుంపరలు', hi: 'बूंदाबांदी' }; }
                        else if (code >= 3) { icon = '☁️'; desc = { en: 'Cloudy', te: 'మబ్బుగా ఉంది', hi: 'बादल छाए हैं' }; }
                        else if (code >= 1) { icon = '⛅'; desc = { en: 'Partly Cloudy', te: 'పాక్షికంగా మబ్బులు', hi: 'आंशिक बादल' }; }

                        weatherData.temp = Math.round(data.current.temperature_2m);
                        weatherData.humidity = Math.round(data.current.relative_humidity_2m);
                        weatherData.wind = Math.round(data.current.wind_speed_10m);
                        weatherData.icon = icon;
                        weatherData.desc = lang === 'te' ? desc.te : (lang === 'hi' ? desc.hi : desc.en);
                    }
                } catch (err) {
                    console.warn('Weather API failed:', err.message);
                }

                // 2. Fetch Location Name from Nominatim (Reverse Geocoding)
                try {
                    const geoResp = await fetchWithTimeout(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`,
                        { headers: { 'User-Agent': 'KarshaApp/1.0 (contact@karsha.app)' } }
                    );
                    const geoData = await geoResp.json();
                    if (geoData.address) {
                        const loc = geoData.address.village || geoData.address.suburb || geoData.address.town || geoData.address.hamlet || geoData.address.city;
                        if (loc) weatherData.location = loc;
                    }
                } catch (err) {
                    console.warn('Geocoding failed:', err.message);
                }

                setWeather(weatherData);

            } catch (e) {
                console.warn('Weather effect failed:', e.message);
            }
        };
        fetchWeather();
    }, [farms, selectedFarmId, lang]);

    // Compute dynamic stats from farm data
    const totalAlerts = farms.reduce((sum, f) => sum + (f.last_analysis?.total_stress_zones || 0), 0);
    const analyzedFarms = farms.filter(f => f.last_analysis);
    const healthyCount = analyzedFarms.filter(f => (f.last_analysis?.field_summary?.healthy_area_pct ?? 0) > 80).length;

    // Average health should only consider analyzed fields for "perfection"
    const avgHealth = analyzedFarms.length > 0
        ? (analyzedFarms.reduce((acc, f) => acc + (f.last_analysis.field_summary?.healthy_area_pct ?? 0), 0) / analyzedFarms.length)
        : null;

    const handleDeleteFarm = async (farmId) => {
        // Use platform-appropriate confirmation
        const confirmed = Platform.OS === 'web'
            ? window.confirm(lang === 'te' ? 'ఈ పొలాన్ని తీసివేయాలా?' : 'Are you sure you want to remove this field?')
            : await new Promise(resolve => {
                Alert.alert(
                    lang === 'te' ? 'తొలగించు' : (lang === 'hi' ? 'खेत हटाएँ' : 'Delete Field'),
                    lang === 'te' ? 'ఈ పొలాన్ని తీసివేయాలా?' : (lang === 'hi' ? 'क्या आप वाकई इस खेत को हटाना चाहते हैं?' : 'Are you sure you want to remove this field?'),
                    [
                        { text: lang === 'te' ? 'రద్దు' : (lang === 'hi' ? 'रद्द करें' : 'Cancel'), style: 'cancel', onPress: () => resolve(false) },
                        { text: lang === 'te' ? 'తొలగించు' : (lang === 'hi' ? 'हटाएँ' : 'Delete'), style: 'destructive', onPress: () => resolve(true) }
                    ]
                );
            });
        if (!confirmed) return;
        try {
            const resp = await fetch(`${BACKEND_URL}/farms/${farmId}`, {
                method: 'DELETE',
                headers: { "bypass-tunnel-reminder": "1" }
            });
            if (resp.ok) {
                loadFarms();
            } else {
                Alert.alert("Error", "Delete failed on server.");
            }
        } catch (e) {
            Alert.alert("Error", "Network problem during deletion.");
        }
    };

    return (
        <View style={[styles.full, { backgroundColor: theme.background }]}>
            <View style={[styles.dashHdr, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                    <View style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        overflow: 'hidden',
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image source={require('../../assets/logo.png')} style={{ width: 52, height: 52 }} resizeMode="cover" />
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '900', color: theme.primary, letterSpacing: -0.5 }}>Karsha</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.iconCircle, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => goTo(18)}>
                    <MaterialCommunityIcons name="cog" size={22} color={theme.primary} />
                </TouchableOpacity>
            </View>


            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.helloText, { color: theme.subText }]}>
                    {lang === 'te' ? 'నమస్కారం 👋' : (lang === 'hi' ? 'नमस्ते 👋' : 'Hello 👋')}
                </Text>
                <Text style={[styles.farmerName, { color: theme.text }]}>{farmerProfile.name || 'Farmer'}</Text>

                <View style={styles.statsRow}>
                    {(() => {
                        const selectedFarm = farms.find(f => f.id === selectedFarmId);
                        const cropInfo = selectedFarm ? (CROPS.find(c => c.id === selectedFarm.crop_type) || { icon: '🌱', en: selectedFarm.crop_type, te: selectedFarm.crop_type }) : null;
                        const farmName = selectedFarm ? (selectedFarm.name || (lang === 'te' ? cropInfo.te : cropInfo.en)) : '';

                        const stats = selectedFarm ? [
                            {
                                l: lang === 'te' ? 'పొలం' : (lang === 'hi' ? 'खेत' : 'FIELD'),
                                v: cropInfo.icon + ' ' + (lang === 'hi' ? (cropInfo.hi || cropInfo.en) : farmName),
                                c: theme.primary,
                                isText: true
                            },
                            {
                                l: lang === 'te' ? 'ఆరోగ్యం' : (lang === 'hi' ? 'स्वास्थ्य' : 'HEALTHY'),
                                v: selectedFarm.last_analysis ? Math.round(selectedFarm.last_analysis.healthy_pct ?? selectedFarm.last_analysis.field_summary?.healthy_area_pct ?? selectedFarm.last_analysis.healthy_area_pct ?? 0) + '%' : '-',
                                c: COLORS.lime
                            },
                            {
                                l: lang === 'te' ? 'హెచ్చరికలు' : (lang === 'hi' ? 'चेतावनी' : 'ALERTS'),
                                v: selectedFarm.last_analysis ? (selectedFarm.last_analysis.alerts ?? selectedFarm.last_analysis.total_stress_zones ?? selectedFarm.last_analysis.total_stress_points ?? selectedFarm.last_analysis.stress_points?.length ?? 0) : '0',
                                c: COLORS.amber
                            }
                        ] : [
                            { l: lang === 'te' ? 'పొలాలు' : (lang === 'hi' ? 'खेत' : 'FIELDS'), v: farms.length, c: theme.primary },
                            { l: lang === 'te' ? 'ఆరోగ్యం' : (lang === 'hi' ? 'स्वास्थ्य' : 'HEALTHY'), v: healthyCount, c: COLORS.lime },
                            { l: lang === 'te' ? 'హెచ్చరికలు' : (lang === 'hi' ? 'चेतावनी' : 'ALERTS'), v: totalAlerts, c: COLORS.amber }
                        ];

                        return stats.map((s, i) => (
                            <TouchableOpacity
                                key={i}
                                style={{ flex: 1 }}
                                onPress={() => (s.l === (lang === 'te' ? 'హెచ్చరికలు' : (lang === 'hi' ? 'चेतावनी' : 'ALERTS'))) && goTo(22)}
                            >
                                <Card theme={theme} style={styles.statCard}>
                                    <Text
                                        style={[styles.statVal, { color: s.c }, s.isText && { fontSize: 13 }]}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                    >
                                        {s.v}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: theme.subText }]}>{s.l}</Text>
                                </Card>
                            </TouchableOpacity>
                        ));
                    })()}
                </View>

                {/* Redesigned Premium Weather Card */}
                <Card theme={theme} style={[styles.weatherCardNew, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: theme.subText, letterSpacing: 0.5 }}>{lang === 'hi' ? 'वर्तमान मौसम' : 'CURRENT WEATHER'}</Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginTop: 2 }}>📍 {weather?.location || 'Kadiri'}</Text>
                        </View>
                        <View style={{ backgroundColor: theme.primary + '10', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                            <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '800' }}>{lang === 'hi' ? 'लाइव अपडेट' : 'Live Updates'}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
                        <Text style={{ fontSize: 44, marginRight: 16 }}>{weather?.icon || '🌤️'}</Text>
                        <View>
                            <Text style={{ fontSize: 36, fontWeight: '900', color: theme.text }}>{weather?.temp && weather.temp !== '--' ? `${weather.temp}°C` : '--'}</Text>
                            <Text style={{ fontSize: 12, color: theme.subText, fontWeight: '600' }}>{weather?.desc || (lang === 'hi' ? 'डेटा प्राप्त किया जा रहा है...' : 'Fetching data...')}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={[styles.weatherStatItem, { backgroundColor: theme.surface }]}>
                            <MaterialCommunityIcons name="water-percent" size={18} color="#0288D1" />
                            <Text style={[styles.weatherStatLabel, { color: theme.text }]}>{weather ? `${weather.humidity}%` : '--'}</Text>
                            <Text style={styles.weatherStatType}>{lang === 'te' ? 'తేమ' : (lang === 'hi' ? 'नमी' : 'Humidity')}</Text>
                        </View>
                        <View style={[styles.weatherStatItem, { backgroundColor: theme.surface }]}>
                            <MaterialCommunityIcons name="weather-windy" size={18} color="#558B2F" />
                            <Text style={[styles.weatherStatLabel, { color: theme.text }]}>{weather ? `${weather.wind}km/h` : '--'}</Text>
                            <Text style={styles.weatherStatType}>{lang === 'te' ? 'గాలి' : (lang === 'hi' ? 'हवा' : 'Wind')}</Text>
                        </View>
                    </View>
                </Card>

                <View style={{ position: 'relative', height: 80, justifyContent: 'center' }}>
                    <Hdr theme={theme} style={{ fontSize: 22, color: theme.primary, fontWeight: '900' }}>
                        {lang === 'te' ? 'నా పొలాలు' : (lang === 'hi' ? 'मेरे खेत' : 'My Fields')}
                    </Hdr>
                    <TouchableOpacity
                        style={[styles.addNewCircle, { position: 'absolute', right: 20, top: 22, backgroundColor: theme.primary }]}
                        onPress={() => onNext(null)}
                    >
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>+</Text>
                    </TouchableOpacity>
                </View>

                {!loading && farms.length === 0 && (
                    <Text style={{ fontSize: 10, color: COLORS.warmGray, textAlign: 'center', marginBottom: 10 }}>
                        ID: {String(farmerId || farmerProfile?.id || 'None')} | Type: {typeof (farmerId || farmerProfile?.id)} | Farms: {farms.length}
                    </Text>
                )}

                {farms.map(f => {
                    const isSelected = f.id === selectedFarmId;
                    const crop = CROPS.find(c => c.id === f.crop_type) || { icon: '🌱', en: f.crop_type, te: f.crop_type };
                    const daysSinceSowing = f.sowing_date ? Math.max(1, Math.floor((Date.now() - new Date(f.sowing_date).getTime()) / 86400000)) : 1;
                    const stage = daysSinceSowing < 7 ? 'Sprouting' : daysSinceSowing < 30 ? 'Vegetative' : daysSinceSowing < 60 ? 'Flowering' : 'Mature';
                    const stageTe = daysSinceSowing < 7 ? 'మొలక' : daysSinceSowing < 30 ? 'వృద్ధి' : daysSinceSowing < 60 ? 'పూత' : 'పరిపక్వ';
                    const stageHi = daysSinceSowing < 7 ? 'अंकुरण' : daysSinceSowing < 30 ? 'वानस्पतिक' : daysSinceSowing < 60 ? 'फूल आना' : 'परिपक्व';
                    const progress = Math.min(100, Math.round((daysSinceSowing / 120) * 100));
                    const areaDisplay = f.area_hectares ? (f.area_hectares / 0.404686).toFixed(1) : '2.5';
                    const analysis = f.last_analysis;
                    const alertCount = analysis?.alerts ?? analysis?.total_stress_zones ?? analysis?.total_stress_points ?? analysis?.stress_points?.length ?? 0;
                    const healthyPct = analysis ? Math.round(analysis.healthy_pct ?? analysis.field_summary?.healthy_area_pct ?? analysis.healthy_area_pct ?? 0) : 0;

                    return (
                        <TouchableOpacity
                            key={f.id}
                            activeOpacity={0.9}
                            onPress={() => setSelectedFarmId(isSelected ? null : f.id)}
                            style={[
                                styles.fieldCardContainer,
                                isSelected && { borderColor: theme.primary, borderWidth: 2, borderRadius: 24 }
                            ]}
                        >
                            {/* Selection Indicator Badge (Only shown when selected) */}
                            {isSelected && (
                                <View style={[
                                    styles.selBadge,
                                    { backgroundColor: theme.primary }
                                ]}>
                                    <MaterialCommunityIcons
                                        name="check-bold"
                                        size={16}
                                        color="white"
                                    />
                                </View>
                            )}

                            <Card theme={theme} style={[styles.fieldCard, { marginBottom: 0, elevation: isSelected ? 0 : 2 }]}>
                                <View style={[styles.fieldMapPlaceholder, { backgroundColor: theme.primary + '20' }]}>
                                    <FieldHeatmap
                                        theme={theme}
                                        points={f.coordinates?.map(p => ({ x: p[0], y: p[1] }))}
                                        status={healthyPct > 80 ? 'healthy' : (healthyPct < 50 ? 'stress' : 'normal')}
                                        width={SCREEN_WIDTH - 40}
                                        height={120}
                                        mini
                                    />
                                    <View style={[styles.fieldBdg, { backgroundColor: healthyPct < 50 ? COLORS.red + 'DD' : (healthyPct > 80 ? theme.primary + 'DD' : 'rgba(0,0,0,0.5)') }]}>
                                        <Text style={styles.fieldBdgText}>
                                            {healthyPct < 50
                                                ? (lang === 'te' ? `${alertCount} హెచ్చరికలు` : (lang === 'hi' ? `${alertCount} अलर्ट` : `${alertCount} Alerts`))
                                                : (healthyPct > 80 ? (lang === 'te' ? 'ఆరోగ్యం' : (lang === 'hi' ? 'स्वस्थ' : 'Healthy')) : (lang === 'te' ? 'స్కాన్ చేయాలి' : (lang === 'hi' ? 'नया स्कैन' : 'New Scan')))
                                            }
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.fieldInfo}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.fieldTitle, { color: theme.text }]}>{crop.icon} {lang === 'te' ? crop.te : (lang === 'hi' ? (crop.hi || crop.en) : crop.en)}</Text>
                                        <Text style={[styles.fieldSub, { color: theme.subText }]}>{areaDisplay} {lang === 'te' ? 'ఎకరాలు' : (lang === 'hi' ? 'एकड़' : 'Acres')} • {lang === 'te' ? stageTe : (lang === 'hi' ? stageHi : stage)}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.red + '10', padding: 6, borderRadius: 6 }}
                                            onPress={(e) => { e.stopPropagation(); handleDeleteFarm(f.id); }}
                                        >
                                            <Text style={{ fontSize: 14 }}>🗑️</Text>
                                            <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.red, marginLeft: 4 }}>
                                                {lang === 'te' ? 'తొలగించు' : 'Delete'}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => onNext(f, 8)}>
                                            <Text style={{ fontSize: 10, fontWeight: '700', color: theme.primary }}>📊 {lang === 'te' ? 'వివరాలు' : (lang === 'hi' ? 'विवरण' : 'Details')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.progressRow, { marginTop: 12 }]}>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: theme.subText }}>{lang === 'te' ? 'పంట అభివృద్ధి' : (lang === 'hi' ? 'फसल की प्रगति' : 'CROP PROGRESS')}</Text>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: theme.primary }}>{progress}%</Text>
                                        </View>
                                        <View style={[styles.progressTrack, { backgroundColor: theme.border + '40', height: 4 }]}>
                                            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.primary, height: '100%' }]} />
                                        </View>
                                    </View>
                                    {analysis && (
                                        <View style={{ width: 60, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: theme.border + '40', paddingLeft: 10 }}>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: theme.subText, marginBottom: 4 }}>{lang === 'te' ? 'ఆరోగ్యం' : 'HEALTH'}</Text>
                                            <Text style={{ fontSize: 11, fontWeight: '900', color: healthyPct > 80 ? COLORS.lime : (healthyPct < 50 ? COLORS.red : COLORS.amber) }}>{healthyPct}%</Text>
                                        </View>
                                    )}
                                </View>
                            </Card>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={[styles.tabBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                {[
                    { ic: "🏠", l: lang === 'te' ? 'హోమ్' : (lang === 'hi' ? 'होम' : 'Home'), act: idx === 7, idx: 7 },
                    { ic: "🔔", l: lang === 'te' ? 'హెచ్చరికలు' : (lang === 'hi' ? 'अलर्ट' : 'Alerts'), act: idx === 22, idx: 22 },
                    { ic: "🩺", l: lang === 'te' ? 'నిర్ధారణ' : (lang === 'hi' ? 'निदान' : 'Diagnosis'), act: false, idx: 10 }
                ].map((t, i) => {
                    const handlePress = () => {
                        if (t.idx === 13 || t.idx === 10) {
                            const selectedFarm = farms.find(f => f.id === selectedFarmId);
                            if (!selectedFarm) {
                                Alert.alert(
                                    lang === 'te' ? "క్షమించాలి" : (lang === 'hi' ? "क्षमा करें" : "Select Field"),
                                    lang === 'te' ? "ముందుగా ఒక పొలాన్ని ఎంచుకోండి." : (lang === 'hi' ? "इस तक पहुँचने के लिए पहले एक खेत चुनें।" : "Please select a field first to access this.")
                                );
                                return;
                            }
                            onNext(selectedFarm); // This will set selField and navigate in App.js
                        } else {
                            goTo(t.idx);
                        }
                    };

                    return t.act ? (
                        <View key={i} style={styles.tabItem}>
                            <Text style={{ fontSize: 20 }}>{t.ic}</Text>
                            <Text style={[styles.tabLabel, { color: theme.primary }]}>{t.l}</Text>
                            <View style={[styles.tabIndicator, { backgroundColor: theme.primary }]} />
                        </View>
                    ) : (
                        <TouchableOpacity key={i} style={styles.tabItem} onPress={handlePress}>
                            <Text style={{ fontSize: 20 }}>{t.ic}</Text>
                            <Text style={[styles.tabLabel, { color: theme.subText }]}>{t.l}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
