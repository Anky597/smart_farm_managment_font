
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorReading } from "@/services/thingspeak-api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatisticsCardProps {
  data: SensorReading[];
  title: string;
  type: "temperature" | "humidity" | "soilMoisture";
  color: string;
}

// Function to cap values to a maximum of 100
const capValue = (value: number): number => {
  return value > 100 ? 100 : value;
};

const StatisticsCard = ({ data, title, type, color }: StatisticsCardProps) => {
  if (!data.length) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }

  // Extract readings for the current sensor type and cap at 100
  const values = data.map(reading => ({
    timestamp: new Date(reading.timestamp).toLocaleDateString(),
    value: capValue(reading[type]),
    rawValue: reading[type], // Store original value for stats calculation
  }));

  // Calculate statistical measures using raw values
  const rawValues = data.map(reading => reading[type]);
  const average = rawValues.reduce((sum, val) => sum + val, 0) / rawValues.length;
  const max = Math.max(...rawValues);
  const min = Math.min(...rawValues);
  const variance = rawValues.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / rawValues.length;
  const stdDev = Math.sqrt(variance);

  // Group data by date for the daily average chart
  const dailyAverages = values.reduce((acc: Record<string, { date: string; total: number; count: number; raw: number[] }>, item) => {
    const date = item.timestamp;
    if (!acc[date]) {
      acc[date] = { date, total: 0, count: 0, raw: [] };
    }
    acc[date].total += item.value;
    acc[date].count += 1;
    acc[date].raw.push(item.rawValue);
    return acc;
  }, {});

  const dailyAverageData = Object.values(dailyAverages).map(item => {
    const rawAvg = item.raw.reduce((sum, val) => sum + val, 0) / item.raw.length;
    return {
      date: item.date,
      average: +(item.total / item.count).toFixed(1),
      rawAverage: +rawAvg.toFixed(1)
    };
  });

  // Prepare distribution data for histogram with capped values
  const getDistributionData = () => {
    // Use capped values for display
    const cappedValues = values.map(item => item.value);
    const min = Math.floor(Math.min(...cappedValues));
    const max = Math.ceil(Math.max(...cappedValues));
    const bins = Math.min(10, max - min + 1);
    const binSize = (max - min) / bins || 1; // Prevent division by zero
    
    // Initialize bins
    const distribution = Array(bins).fill(0).map((_, i) => ({
      range: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
      count: 0
    }));
    
    // Count values in each bin
    cappedValues.forEach(value => {
      const binIndex = Math.min(
        Math.floor((value - min) / binSize),
        bins - 1
      );
      if (binIndex >= 0) {
        distribution[binIndex].count += 1;
      }
    });
    
    return distribution;
  };

  return (
    <Card className="data-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <UITooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Chart values are capped at 100 for better visualization</p>
            <p>Statistics are calculated using original values</p>
          </TooltipContent>
        </UITooltip>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Average</span>
            <span className="text-xl font-bold">{average.toFixed(1)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Min</span>
            <span className="text-xl font-bold">{min.toFixed(1)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Max</span>
            <span className="text-xl font-bold">{max.toFixed(1)}</span>
            {max > 100 && <span className="text-xs text-muted-foreground">(Displayed as 100)</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Std Dev</span>
            <span className="text-xl font-bold">{stdDev.toFixed(1)}</span>
          </div>
        </div>
        
        <Tabs defaultValue="trends">
          <TabsList className="mb-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyAverageData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const entry = payload[0];
                      return (
                        <div className="bg-background border border-border p-2 rounded-md shadow-md">
                          <p className="font-medium">{label}</p>
                          <p style={{ color: entry.color }}>
                            {`${title}: ${entry.value}`}
                            {entry.payload.rawAverage > 100 ? 
                              ` (actual: ${entry.payload.rawAverage})` : ''}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  name={`Daily Average ${title}`}
                  stroke={color} 
                  strokeWidth={2}
                  dot={{ fill: color, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="distribution" className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getDistributionData()}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  name="Frequency" 
                  fill={color} 
                  opacity={0.8} 
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
