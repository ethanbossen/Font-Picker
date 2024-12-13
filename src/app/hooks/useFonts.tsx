import { useState, useEffect } from "react";
import axios from "axios";
import { WebfontList } from "google-fonts";

// Define the URL for the Google Fonts API
const googleFontsUrl = "https://www.googleapis.com/webfonts/v1/webfonts?key=API_KEY_HERE";

// Custom hook to fetch the list of Google Fonts
function useFonts() {
    const [fonts, setFonts] = useState<WebfontList | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFonts = async () => {
            try {
                const response = await axios.get<WebfontList>(googleFontsUrl);
                setFonts(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch fonts.");
                setLoading(false);
            }
        };

        fetchFonts();
    }, []);

    return { fonts, loading, error };
}

export { useFonts };