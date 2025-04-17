
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Sprout, Loader2 } from 'lucide-react';
import { SensorReading, getSensorStatus } from '@/services/thingspeak-api';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  latestReading: SensorReading | null;
  loading: boolean;
}

const StatusCard = ({ title, latestReading, loading }: StatusCardProps) => {
  if (loading) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestReading) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const tempStatus = getSensorStatus(latestReading.temperature, 'temperature');
  const humidityStatus = getSensorStatus(latestReading.humidity, 'humidity');
  const soilStatus = getSensorStatus(latestReading.soilMoisture, 'soilMoisture');

  return (
    <Card className="data-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {new Date(latestReading.timestamp).toLocaleDateString()} {new Date(latestReading.timestamp).toLocaleTimeString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50">
            <Thermometer className={cn(
              "h-6 w-6 mb-1",
              `sensor-${tempStatus}`
            )} />
            <div className="stats-value">{latestReading.temperature}°C</div>
            <div className="stats-label">Temperature</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50">
            <Droplets className={cn(
              "h-6 w-6 mb-1",
              `sensor-${humidityStatus}`
            )} />
            <div className="stats-value">{latestReading.humidity}%</div>
            <div className="stats-label">Humidity</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50">
            <Sprout className={cn(
              "h-6 w-6 mb-1",
              `sensor-${soilStatus}`
            )} />
            <div className="stats-value">{latestReading.soilMoisture}%</div>
            <div className="stats-label">Soil Moisture</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
