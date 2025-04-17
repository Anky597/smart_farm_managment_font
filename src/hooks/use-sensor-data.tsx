
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchSensorData, 
  fetchLatestSensorData, 
  getApiStatus, 
  calculateSensorStats,
  SensorReading,
  ApiStatus
} from '@/services/thingspeak-api';
import { toast } from 'sonner';

export function useSensorData(days = 1) {
  const [data, setData] = useState<SensorReading[]>([]);
  const [latest, setLatest] = useState<SensorReading | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>(getApiStatus());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    avgTemp: 0,
    avgHumidity: 0,
    avgSoilMoisture: 0,
    minTemp: 0,
    maxTemp: 0,
    minHumidity: 0,
    maxHumidity: 0,
    minSoilMoisture: 0,
    maxSoilMoisture: 0
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching sensor data for the past ${days} days...`);
      const readings = await fetchSensorData(days);
      console.log(`Received ${readings.length} readings`);
      
      setData(readings);
      
      if (readings.length > 0) {
        setLatest(readings[0]);
        const calculatedStats = calculateSensorStats(readings);
        setStats(calculatedStats);
        console.log('Latest reading:', readings[0]);
        console.log('Calculated stats:', calculatedStats);
        toast.success('Sensor data updated successfully');
      } else {
        console.log('No readings received');
        toast.warning('No sensor data available');
      }
      
      setApiStatus(getApiStatus());
    } catch (err) {
      console.error('Error in useSensorData hook:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error('Failed to fetch sensor data');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
    
    // Set up automatic refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing sensor data...');
      fetchData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchData]);

  return {
    data,
    latest,
    apiStatus,
    loading,
    error,
    stats,
    refresh: fetchData
  };
}
