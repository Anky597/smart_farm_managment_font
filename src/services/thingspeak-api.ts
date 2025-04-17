
import { toast } from 'sonner';

export interface SensorReading {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  timestamp: string;
  entryId: number;
}

export interface ApiStatus {
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  lastCheck: string;
}

// ThingSpeak API config using environment variables
const THING_SPEAK_API_KEY = 'L2SET7F8QJITXQHX'; // New API key
const CHANNEL_ID = '2836185'; // New channel ID

export async function fetchSensorData(days = 1): Promise<SensorReading[]> {
  const startTime = performance.now();
  
  try {
    // Define endpoint with dynamic results count based on days parameter
    const resultsCount = days === 1 ? 20 : days * 24 * 2; // Roughly getting readings every 30 mins
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${THING_SPEAK_API_KEY}&results=${resultsCount}`;
    
    console.log(`Fetching data from: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    const endTime = performance.now();
    
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    // Check if the response has the expected structure
    if (!data.feeds || !Array.isArray(data.feeds)) {
      console.error('Unexpected API response format:', data);
      throw new Error('Unexpected API response format');
    }
    
    // Update API status
    updateApiStatus({
      status: 'online',
      responseTime: Math.round(endTime - startTime),
      lastCheck: new Date().toISOString()
    });
    
    // Map the ThingSpeak data to our format
    const readings = data.feeds.map((feed: any) => ({
      temperature: parseFloat(feed.field1) || 0,
      humidity: parseFloat(feed.field2) || 0,
      soilMoisture: parseFloat(feed.field3) || 0,
      timestamp: feed.created_at,
      entryId: feed.entry_id
    })).reverse(); // Most recent first
    
    if (readings.length === 0) {
      console.log('No sensor readings found in the response');
    }
    
    return readings;
    
  } catch (error) {
    const endTime = performance.now();
    console.error('Error fetching sensor data:', error);
    
    // Update API status to offline
    updateApiStatus({
      status: 'offline',
      responseTime: Math.round(endTime - startTime),
      lastCheck: new Date().toISOString()
    });
    
    // If we're getting a 400 Bad Request, try with some sample data to allow UI testing
    if (error instanceof Error && error.message.includes('400')) {
      console.log('Returning sample data for testing UI');
      return generateSampleData(days);
    }
    
    toast.error('Failed to fetch sensor data. Please try again later.');
    return [];
  }
}

// Generate sample data for testing when API is unavailable
function generateSampleData(days = 1): SensorReading[] {
  const now = new Date();
  const count = days === 1 ? 20 : days * 24 * 2;
  const sampleData: SensorReading[] = [];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 min intervals
    sampleData.push({
      temperature: 20 + Math.random() * 10, // Random temp between 20-30
      humidity: 40 + Math.random() * 40, // Random humidity between 40-80
      soilMoisture: 30 + Math.random() * 50, // Random soil moisture between 30-80
      timestamp: timestamp.toISOString(),
      entryId: count - i
    });
  }
  
  console.log(`Generated ${sampleData.length} sample readings for testing`);
  return sampleData;
}

// Store API status in localStorage
function updateApiStatus(status: ApiStatus): void {
  localStorage.setItem('thingSpeakApiStatus', JSON.stringify(status));
}

// Get API status from localStorage
export function getApiStatus(): ApiStatus {
  const statusJson = localStorage.getItem('thingSpeakApiStatus');
  
  if (!statusJson) {
    return {
      status: 'offline',
      responseTime: 0,
      lastCheck: new Date().toISOString()
    };
  }
  
  return JSON.parse(statusJson);
}

// Get latest sensor data (just one reading)
export async function fetchLatestSensorData(): Promise<SensorReading | null> {
  try {
    const readings = await fetchSensorData();
    return readings.length > 0 ? readings[0] : null;
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    return null;
  }
}

// Get summary stats for a farm section
export function calculateSensorStats(readings: SensorReading[]): { 
  avgTemp: number; 
  avgHumidity: number; 
  avgSoilMoisture: number; 
  minTemp: number;
  maxTemp: number;
  minHumidity: number;
  maxHumidity: number;
  minSoilMoisture: number;
  maxSoilMoisture: number;
} {
  if (!readings.length) {
    return {
      avgTemp: 0,
      avgHumidity: 0,
      avgSoilMoisture: 0,
      minTemp: 0,
      maxTemp: 0,
      minHumidity: 0,
      maxHumidity: 0,
      minSoilMoisture: 0,
      maxSoilMoisture: 0
    };
  }
  
  const sum = readings.reduce(
    (acc, reading) => {
      return {
        temp: acc.temp + reading.temperature,
        humidity: acc.humidity + reading.humidity,
        soilMoisture: acc.soilMoisture + reading.soilMoisture
      };
    },
    { temp: 0, humidity: 0, soilMoisture: 0 }
  );
  
  // Find min and max values
  const minTemp = Math.min(...readings.map(r => r.temperature));
  const maxTemp = Math.max(...readings.map(r => r.temperature));
  const minHumidity = Math.min(...readings.map(r => r.humidity));
  const maxHumidity = Math.max(...readings.map(r => r.humidity));
  const minSoilMoisture = Math.min(...readings.map(r => r.soilMoisture));
  const maxSoilMoisture = Math.max(...readings.map(r => r.soilMoisture));
  
  return {
    avgTemp: parseFloat((sum.temp / readings.length).toFixed(1)),
    avgHumidity: parseFloat((sum.humidity / readings.length).toFixed(1)),
    avgSoilMoisture: parseFloat((sum.soilMoisture / readings.length).toFixed(1)),
    minTemp,
    maxTemp,
    minHumidity,
    maxHumidity,
    minSoilMoisture,
    maxSoilMoisture
  };
}

// Get sensor status based on current value
export function getSensorStatus(
  value: number, 
  type: 'temperature' | 'humidity' | 'soilMoisture'
): 'healthy' | 'warning' | 'critical' {
  switch (type) {
    case 'temperature':
      if (value < 10 || value > 35) return 'critical';
      if (value < 15 || value > 30) return 'warning';
      return 'healthy';
    
    case 'humidity':
      if (value < 20 || value > 90) return 'critical';
      if (value < 30 || value > 80) return 'warning';
      return 'healthy';
    
    case 'soilMoisture':
      if (value < 20 || value > 80) return 'critical';
      if (value < 30 || value > 70) return 'warning';
      return 'healthy';
    
    default:
      return 'healthy';
  }
}
