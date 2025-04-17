
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SensorReading } from '@/services/thingspeak-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface SensorLineChartProps {
  data: SensorReading[];
  loading: boolean;
}

const SensorLineChart = ({ data, loading }: SensorLineChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (data.length) {
      // Format data for chart
      const formattedData = data.map((reading) => ({
        timestamp: new Date(reading.timestamp).toLocaleTimeString(),
        temperature: reading.temperature,
        humidity: reading.humidity,
        soilMoisture: reading.soilMoisture,
      }));
      
      setChartData(formattedData);
    }
  }, [data]);
  
  if (loading) {
    return (
      <Card className="data-card col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Sensor Readings</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (!data.length) {
    return (
      <Card className="data-card col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Sensor Readings</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="data-card col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Sensor Readings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Metrics</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
            <TabsTrigger value="soilMoisture">Soil Moisture</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temperature (°C)"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.2} 
                />
                <Area 
                  type="monotone" 
                  dataKey="humidity" 
                  name="Humidity (%)"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.2} 
                />
                <Area 
                  type="monotone" 
                  dataKey="soilMoisture" 
                  name="Soil Moisture (%)"
                  stroke="#4CAF50" 
                  fill="#4CAF50" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="temperature" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temperature (°C)"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="humidity" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="humidity" 
                  name="Humidity (%)"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="soilMoisture" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="soilMoisture" 
                  name="Soil Moisture (%)"
                  stroke="#4CAF50" 
                  fill="#4CAF50" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SensorLineChart;
