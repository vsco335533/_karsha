import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS } from '../Translations';

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
    const [lang, setLangState] = useState('en'); // default to English

    useEffect(() => {
        // Load saved language preference
        const loadLang = async () => {
            try {
                const savedLang = await AsyncStorage.getItem('karsha_lang');
                if (savedLang) {
                    setLangState(savedLang);
                }
            } catch (e) {
                console.error('Failed to load language', e);
            }
        };
        loadLang();
    }, []);

    const setLang = async (newLang) => {
        try {
            await AsyncStorage.setItem('karsha_lang', newLang);
            setLangState(newLang);
        } catch (e) {
            console.error('Failed to save language', e);
        }
    };

    const t = (key) => {
        return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
    };

    return (
        <LocalizationContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
