import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { toast } from 'sonner';
import { useSensorData } from '@/hooks/use-sensor-data';
import { Button } from '@/components/ui/button';
import { ChartBar, ChartLine, RefreshCw, Download, Info } from 'lucide-react';
import DateRangePicker from '@/components/reports/DateRangePicker';
import ReportDataTable from '@/components/reports/ReportDataTable';
import StatisticsCard from '@/components/reports/StatisticsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const capValue = (value: number): number => {
  return value > 100 ? 100 : value;
};

const Reports = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  
  const [activeTab, setActiveTab] = useState('charts');
  const { data, loading, refresh } = useSensorData(7);
  
  const handleExportCSV = useCallback(() => {
    if (!data.length) {
      toast.error('No data available to export');
      return;
    }
    
    const headers = ['Date', 'Time', 'Temperature', 'Humidity', 'Soil Moisture', 'Entry ID'];
    const csvRows = [headers.join(',')];
    
    data.forEach((reading) => {
      const date = new Date(reading.timestamp);
      const row = [
        format(date, 'yyyy-MM-dd'),
        format(date, 'HH:mm:ss'),
        reading.temperature,
        reading.humidity,
        reading.soilMoisture,
        reading.entryId
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `farm-data-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV file downloaded successfully');
  }, [data]);
  
  const filteredData = dateRange?.from && dateRange?.to
    ? data.filter(reading => {
        const date = new Date(reading.timestamp);
        return (
          date >= dateRange.from! && 
          date <= (dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59)) : new Date())
        );
      })
    : data;
  
  const chartData = filteredData.map((reading) => ({
    timestamp: format(new Date(reading.timestamp), 'MM/dd HH:mm'),
    temperature: capValue(reading.temperature),
    humidity: capValue(reading.humidity),
    soilMoisture: capValue(reading.soilMoisture),
    raw_temperature: reading.temperature,
    raw_humidity: reading.humidity,
    raw_soilMoisture: reading.soilMoisture,
  }));
  
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farm Reports</h1>
          <p className="text-muted-foreground">
            View and analyze historical data from your farm
          </p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chart values are capped at 100 for better visualization</p>
            </TooltipContent>
          </Tooltip>
          <Button 
            onClick={refresh} 
            disabled={loading}
            className="h-9"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">
        <div className="lg:col-span-3">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
        <div className="lg:col-span-3 flex items-center">
          <p className="text-sm text-muted-foreground">
            {dateRange?.from && dateRange?.to
              ? `Showing data from ${format(dateRange.from, 'MMMM dd, yyyy')} to ${format(dateRange.to, 'MMMM dd, yyyy')}`
              : 'Select a date range to filter data'}
          </p>
        </div>
        <div className="lg:col-span-1 flex justify-end">
          <Button variant="outline" size="icon" onClick={handleExportCSV} disabled={loading || !data.length}>
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <ChartLine className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="data">Raw Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          <div className="mb-6 rounded-lg border bg-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Sensor History</h3>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                Values capped at 100
              </div>
            </div>
            <div className="h-[400px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-border p-2 rounded-md shadow-md">
                              <p className="font-medium">{label}</p>
                              {payload.map((entry, index) => (
                                <p key={index} style={{ color: entry.color }}>
                                  {entry.name}: {entry.value}
                                  {entry.dataKey.toString().includes('temperature') ? '°C' : '%'}
                                  {entry.payload[`raw_${entry.dataKey}`] > 100 ? 
                                    ` (actual: ${entry.payload[`raw_${entry.dataKey}`]})` : ''}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
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
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available for the selected period
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatisticsCard
              data={filteredData}
              title="Temperature Analysis"
              type="temperature"
              color="#ef4444"
            />
            <StatisticsCard
              data={filteredData}
              title="Humidity Analysis"
              type="humidity"
              color="#3b82f6"
            />
            <StatisticsCard
              data={filteredData}
              title="Soil Moisture Analysis"
              type="soilMoisture"
              color="#4CAF50"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          <div className="rounded-lg border bg-card">
            <ReportDataTable
              data={filteredData}
              loading={loading}
              onExport={handleExportCSV}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Reports;
