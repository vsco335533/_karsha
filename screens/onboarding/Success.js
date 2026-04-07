import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../theme';
import { Hdr, Btn } from '../../components/Shared';
import { styles } from './styles';

export const S5b_Success = ({ next, lang }) => (
    <View style={[styles.full, { alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
        <View style={styles.successBadge}><Text style={{ fontSize: 42, color: COLORS.white }}>✓</Text></View>
        <Hdr style={{ marginTop: 24, textAlign: 'center' }}>
            {lang === 'te' ? 'పర్యవేక్షణ ప్రారంభమైంది!' : (lang === 'hi' ? 'निगरानी शुरू हो गई है!' : 'Monitoring Started!')}
        </Hdr>
        <Text style={styles.heroText}>
            {lang === 'te' ? 'మీ పొలం ఇప్పుడు ఉపగ్రహం ద్వారా పర్యవేక్షించబడుతోంది.' : (lang === 'hi' ? 'आपके खेत की अब सैटेलाइट द्वारा निगरानी की जा रही है।' : 'Your field is now being monitored by satellite.')}
        </Text>
        <Btn onClick={next} style={{ marginTop: 40 }}>{lang === 'te' ? 'డాష్బోర్డ్ చూడండి' : (lang === 'hi' ? 'डैशबोर्ड देखें' : 'View Dashboard')}</Btn>
    </View>
);
