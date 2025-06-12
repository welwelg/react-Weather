//
import React, { useState, useEffect } from 'react';
import { getWeatherByCity, getForecastByCity } from './weatherService';
import './App.css';

function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [isNightMode, setIsNightMode] = useState(false);
    const [isAutoMode, setIsAutoMode] = useState(true);

    // Check if it's night time
    useEffect(() => {
        const checkTime = () => {
            if (isAutoMode) {
                const currentHour = new Date().getHours();
                setIsNightMode(currentHour >= 18 || currentHour < 6);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [isAutoMode]);

    // Load recent searches from localStorage on component mount
    useEffect(() => {
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    // Save recent searches to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    const handleSearch = async() => {
        if (!city.trim()) return;

        setLoading(true);
        setError('');
        try {
            const weatherData = await getWeatherByCity(city);
            if (!weatherData || !weatherData.main || !weatherData.weather) {
                throw new Error('Invalid weather data received');
            }
            setWeather(weatherData);

            const forecastData = await getForecastByCity(city);
            if (!forecastData || !forecastData.list) {
                throw new Error('Invalid forecast data received');
            }
            setForecast(forecastData);

            // Add to recent searches
            const newSearch = {
                city: city,
                weather: weatherData,
                timestamp: new Date().toISOString()
            };

            setRecentSearches(prev => {
                const filtered = prev.filter(search => search.city.toLowerCase() !== city.toLowerCase());
                return [newSearch, ...filtered].slice(0, 5); // Keep only 5 most recent searches
            });
        } catch (error) {
            setError('Failed to fetch weather data. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecentSearch = (search) => {
        if (!search || !search.weather || !search.weather.main) {
            setError('Invalid weather data in recent search');
            return;
        }
        setCity(search.city);
        setWeather(search.weather);
    };

    const getWeatherIcon = (weatherCode) => {
        // You can replace these with actual weather icons
        const icons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Snow': '❄️',
            'Thunderstorm': '⛈️',
            'Drizzle': '🌦️',
            'Mist': '🌫️'
        };
        return icons[weatherCode] || '🌡️';
    };

    const toggleTheme = () => {
        setIsAutoMode(false);
        setIsNightMode(prev => !prev);
    };

    return ( <
        div className = { `weather-app ${isNightMode ? 'night-mode' : 'day-mode'}` } >
        <
        button className = "theme-toggle"
        onClick = { toggleTheme }
        title = { isNightMode ? "Switch to Light Mode" : "Switch to Dark Mode" } > { isNightMode ? '☀️' : '🌙' } <
        /button>

        <
        div className = "app-header" >
        <
        div className = "logo-container" >
        <
        span className = "logo-icon" > { isNightMode ? '🌙' : '☀️' } < /span> <
        h1 className = "app-title" > WelTechCode - WeatherApp < /h1> < /
        div > <
        /div>

        <
        div className = "search-container" >
        <
        input type = "text"
        value = { city }
        onChange = {
            (e) => setCity(e.target.value)
        }
        placeholder = "Enter city name"
        onKeyPress = {
            (e) => e.key === 'Enter' && handleSearch()
        }
        /> <
        button onClick = { handleSearch }
        disabled = { loading } > { loading ? 'Loading...' : 'Get Weather' } <
        /button> < /
        div >

        {
            error && < div className = "error-message" > { error } < /div>}

            {
                recentSearches.length > 0 && ( <
                    div className = "recent-searches" >
                    <
                    h3 > Recent Searches < /h3> <
                    div className = "recent-searches-list" > {
                        recentSearches.map((search, index) => (
                            search && search.weather && search.weather.main && ( <
                                div key = { index }
                                className = "recent-search-item"
                                onClick = {
                                    () => handleRecentSearch(search)
                                } >
                                <
                                div className = "recent-search-city" > { search.city } < /div> <
                                div className = "recent-search-temp" > { Math.round(search.weather.main.temp) }°
                                C <
                                /div> <
                                div className = "recent-search-icon" > { getWeatherIcon(search.weather.weather[0].main) } <
                                /div> <
                                div className = "recent-search-time" > { new Date(search.timestamp).toLocaleTimeString() } <
                                /div> < /
                                div >
                            )
                        ))
                    } <
                    /div> < /
                    div >
                )
            }

            {
                weather && weather.weather && weather.weather.length > 0 && weather.main && ( <
                    div className = "current-weather" >
                    <
                    div className = "weather-main" >
                    <
                    h2 > { weather.name } < /h2> <
                    div className = "weather-icon" > { getWeatherIcon(weather.weather[0].main) } <
                    /div> <
                    div className = "temperature" >
                    <
                    span className = "temp-value" > { Math.round(weather.main.temp) }°
                    C < /span> <
                    span className = "feels-like" > Feels like: { Math.round(weather.main.feels_like) }°
                    C < /span> < /
                    div > <
                    p className = "weather-description" > { weather.weather[0].description } < /p> < /
                    div > <
                    div className = "weather-details" >
                    <
                    div className = "detail-item" >
                    <
                    span > Humidity < /span> <
                    span > { weather.main.humidity } % < /span> < /
                    div > <
                    div className = "detail-item" >
                    <
                    span > Wind < /span> <
                    span > { weather.wind.speed }
                    m / s < /span> < /
                    div > <
                    div className = "detail-item" >
                    <
                    span > Pressure < /span> <
                    span > { weather.main.pressure }
                    hPa < /span> < /
                    div > <
                    /div> < /
                    div >
                )
            }

            {
                forecast && forecast.list && ( <
                    div className = "forecast-container" >
                    <
                    h3 > 5 - Day Forecast < /h3> <
                    div className = "forecast-list" > {
                        forecast.list
                        .filter((_, index) => index % 8 === 0)
                        .map((item, index) => (
                            item && item.main && item.weather && item.weather[0] && ( <
                                div key = { index }
                                className = "forecast-item" >
                                <
                                div className = "forecast-date" > { new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short' }) } <
                                /div> <
                                div className = "forecast-icon" > { getWeatherIcon(item.weather[0].main) } <
                                /div> <
                                div className = "forecast-temp" > { Math.round(item.main.temp) }°
                                C <
                                /div> <
                                div className = "forecast-desc" > { item.weather[0].main } <
                                /div> < /
                                div >
                            )
                        ))
                    } <
                    /div> < /
                    div >
                )
            } <
            /div>
        );
    }

    export default App;