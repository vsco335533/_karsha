import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme';
import { Hdr, Lbl } from '../../components/Shared';
import { styles } from './styles';

export const S4_Method = ({ next, back, lang }) => (
    <View style={styles.full}>
        <Hdr onBack={back}>{lang === 'te' ? 'పొలం హద్దులు' : (lang === 'hi' ? 'खेत की सीमा' : 'Field Boundary')}</Hdr>
        <View style={{ flex: 1, padding: 24 }}>
            <Lbl style={{ textAlign: 'center', marginBottom: 24, fontSize: 13 }}>
                {lang === 'te' ? 'పొలం సరిహద్దును గుర్తించడానికి ఒక పద్ధతిని ఎంచుకోండి' : (lang === 'hi' ? 'खेत की सीमा को चिह्नित करने के लिए एक विधि चुनें' : 'Select a method to mark your field boundary')}
            </Lbl>

            <TouchableOpacity style={styles.methodCard} onPress={next}>
                <View style={[styles.methodIcon, { backgroundColor: COLORS.paleGreen }]}>
                    <Text style={{ fontSize: 24 }}>📍</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>{lang === 'te' ? 'పొలంలో నడవండి' : (lang === 'hi' ? 'खेत में चलें' : 'Walk the field')}</Text>
                    <Text style={styles.methodSub}>{lang === 'te' ? 'మీ పొలం చుట్టూ నడుస్తూ GPS ద్వారా బిందువులను గుర్తించండి.' : (lang === 'hi' ? 'खेत के चारों ओर घूमें और GPS का उपयोग करके बिंदुओं को चिह्नित करें।' : 'Walk around your field and mark points using GPS.')}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.methodCard} onPress={next}>
                <View style={[styles.methodIcon, { backgroundColor: COLORS.cream }]}>
                    <Text style={{ fontSize: 24 }}>🗺️</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>{lang === 'te' ? 'మ్యాప్‌లో గుర్తించండి' : (lang === 'hi' ? 'मानचित्र पर चिह्नित करें' : 'Mark on Map')}</Text>
                    <Text style={styles.methodSub}>{lang === 'te' ? 'మ్యాప్‌లో క్లిక్ చేయడం ద్వారా హద్దులను గీయండి' : (lang === 'hi' ? 'सैटेलाइट इमेज पर टैप करके सीमाएँ बनाएँ' : 'Draw boundaries by tapping on satellite image')}</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
);
