import { useState } from 'react';

// This is the main component for the weather app.
// React components are like reusable UI building blocks.
const App = () => {
  // useState stores data in memory.
  // weatherData = weather response from API
  // loading = tells us if the request is in progress
  // error = holds any error message to show to the user
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function runs when the form is submitted.
  // It prevents the page from reloading and fetches weather data.
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop browser default form reload

    // Read the city typed into the input field.
    const cityName = e.target.city_input.value.trim();

    // Basic validation: if no city is entered, show an error.
    if (!cityName) {
      setError('Please enter a city name');
      setWeatherData(null);
      return;
    }

    // Start loading and clear old errors.
    setLoading(true);
    setError(null);

    try {
      // Read the API key from the .env file.
      // VITE_ prefix is required for Vite projects.
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

      // Fetch weather from OpenWeatherMap using the city name and API key.
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      // Convert the response into a JavaScript object.
      const data = await response.json();

      // If the API says the city was not found, set an error.
      if (data.cod !== 200) {
        setError(data.message || 'City not found');
        setWeatherData(null);
      } else {
        // Save successful weather data so the UI can display it.
        setWeatherData(data);
      }
    } catch (err) {
      // If the request fails (network issue, bad API key, etc.), show error.
      // Using the caught value avoids the no-unused-vars lint warning.
      console.error('Weather fetch failed:', err);
      setError('Error fetching weather data');
      setWeatherData(null);
    } finally {
      // Always stop the loading state when the request finishes.
      setLoading(false);
    }
  };

  return (
    <>
      {/* This is the input form for searching a city. */}
      <form onSubmit={handleSubmit}>
        {/* name="city_input" is used in e.target.city_input.value above */}
        <input name="city_input" type="text" placeholder="City name" />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {/* This is the weather card section. */}
      <div className="weather-card">
        <h2>Weather Information</h2>

        {/* If there is an error, show it. */}
        {error && <p>{error}</p>}

        {/* If weatherData exists, show the weather details. */}
        {weatherData ? (
          <>
            <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
            <p>Condition: {weatherData.weather[0].main}</p>
            <p>City: {weatherData.name}</p>
          </>
        ) : (
          // Otherwise show a default message.
          <p>Search for a city to see the weather.</p>
        )}
      </div>
    </>
  );
};

export default App;