import axios from "axios";

const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

export const fetchLocationSuggestions = async (query) => {
  try {
    const response = await axios.get(
      "https://api.locationiq.com/v1/autocomplete",
      {
        params: {
          key: API_KEY,
          q: query,
          limit: 5,
          dedupe: 1,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Location fetch error:", error);
    return [];
  }
};