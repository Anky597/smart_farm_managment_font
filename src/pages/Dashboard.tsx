
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSensorData } from '@/hooks/use-sensor-data';
import StatusCard from '@/components/dashboard/StatusCard';
import ApiStatusCard from '@/components/dashboard/ApiStatusCard';
import StatsCard from '@/components/dashboard/StatsCard';
import SensorLineChart from '@/components/dashboard/SensorLineChart';

const Dashboard = () => {
  const { data, latest, apiStatus, loading, stats, refresh } = useSensorData();
  
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farm Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your farm sensors and environment metrics
          </p>
        </div>
        <Button 
          onClick={refresh} 
          disabled={loading}
          className="mt-4 md:mt-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatusCard 
          title="North Field - Section 1" 
          latestReading={latest}
          loading={loading}
        />
        <StatusCard 
          title="North Field - Section 2" 
          latestReading={latest}
          loading={loading}
        />
      </div>
      
      <ApiStatusCard 
        apiStatus={apiStatus} 
        onRefresh={refresh} 
        loading={loading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatsCard 
          title="Avg Temperature"
          value={stats.avgTemp}
          unit="°C"
          delta={1.5}
          loading={loading}
        />
        <StatsCard 
          title="Avg Humidity"
          value={stats.avgHumidity}
          unit="%"
          delta={-2.3}
          loading={loading}
        />
        <StatsCard 
          title="Avg Soil Moisture"
          value={stats.avgSoilMoisture}
          unit="%"
          delta={0.8}
          loading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <SensorLineChart data={data} loading={loading} />
        
        <div className="grid grid-cols-1 gap-6">
          <StatusCard 
            title="South Field - Section 1" 
            latestReading={latest}
            loading={loading}
          />
          <StatusCard 
            title="South Field - Section 2" 
            latestReading={latest}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
