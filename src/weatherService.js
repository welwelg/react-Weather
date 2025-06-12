import axios from 'axios';

const API_KEY = '6c6b9570c9d2681c9931342608ed74b3';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByCity = async(city) => {
    try {
        const response = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: city,
                    appid: API_KEY,
                    units: 'metric',
                },
            });
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`Weather API Error: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from weather service. Please check your internet connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error: ${error.message}`);
        }
    }
};

export const getForecastByCity = async(city) => {
    try {
        const response = await axios.get(
            'https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    q: city,
                    appid: API_KEY,
                    units: 'metric',
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`Forecast API Error: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from forecast service. Please check your internet connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error: ${error.message}`);
        }
    }
};