// utils/weather.js

export const getWeatherData = async (longitude, latitude) => {
    if (!longitude || !latitude) {
      console.error("Invalid coordinates: Longitude and Latitude are required");
      return null;
    }
  
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
  
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=precipitation&timezone=Asia%2FColombo`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
  
      const data = await response.json();
  
      const totalRainfall = data.hourly?.precipitation?.reduce(
        (sum, rainfall) => sum + (rainfall || 0),
        0
      ).toFixed(2);
      return totalRainfall;
    } catch (error) {
      console.error("Error fetching weather data: ", error.message);
      return null;
    }
  };
  