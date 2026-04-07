export let BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "https://karsha.onrender.com";

export const setBackendUrl = (url) => {
    BACKEND_URL = url;
};


export const CROPS = [
    { id: "rice", te: "వరి", hi: "धान / चावल", en: "Paddy / Rice", icon: "🌾" },
    { id: "cotton", te: "పత్తి", hi: "कपास", en: "Cotton", icon: "☁️" },
    { id: "groundnut", te: "వేరుశెనగ", hi: "मूंगफली", en: "Groundnut", icon: "🥜" },
    { id: "chilli", te: "మిర్చి", hi: "मिर्च", en: "Chilli", icon: "🌶️" },
    { id: "tomato", te: "టమాటో", hi: "टमाटर", en: "Tomato", icon: "🍅" },
    { id: "maize", te: "మొక్కజొన్న", hi: "मक्का", en: "Maize", icon: "🌽" },
    { id: "turmeric", te: "పసుపు", hi: "हल्दी", en: "Turmeric", icon: "🟡" },
    { id: "sugarcane", te: "చెరకు", hi: "गन्ना", en: "Sugarcane", icon: "🎋" },
    { id: "mango", te: "మామిడి", hi: "आम", en: "Mango", icon: "🥭" },
    { id: "tobacco", te: "పొగాకు", hi: "तंबाकू", en: "Tobacco", icon: "🍂" },
    { id: "custom", te: "ఇతర", hi: "अन्य", en: "Other / Custom", icon: "➕" },
];

export const SOIL_TYPES = [
    { id: "red", te: "ఎర్ర మట్టి", hi: "लाल मिट्टी", en: "Red Soil" },
    { id: "black", te: "నల్ల రేగడి", hi: "काली मिट्टी", en: "Black Cotton Soil" },
    { id: "alluvial", te: "ఒండ్రు మట్టి", hi: "जलोढ़ मिट्टी", en: "Alluvial Soil" },
    { id: "sandy", te: "ఇసుక మట్టి", hi: "रेतीली मिट्टी", en: "Sandy Soil" },
    { id: "loamy", te: "గరప మట్టి", hi: "दोमट मिट्टी", en: "Loamy Soil" },
    { id: "custom", te: "ఇతర", hi: "अन्य", en: "Other / Custom" },
];

export const IRRIGATION = [
    { id: "rainfed", te: "వర్షాధారం", hi: "वर्षा आधारित", en: "Rainfed", icon: "🌧️" },
    { id: "borewell", te: "బోర్వెల్", hi: "बोरवेल", en: "Borewell", icon: "💧" },
    { id: "canal", te: "కాలువ", hi: "नहर", en: "Canal", icon: "🏞️" },
    { id: "drip", te: "బిందు సేద్యం", hi: "ड्रिप सिंचाई", en: "Drip", icon: "💦" },
    { id: "custom", te: "ఇతర", hi: "अन्य", en: "Other / Custom", icon: "➕" },
];
