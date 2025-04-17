
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { ApiStatus } from '@/services/thingspeak-api';
import { cn } from '@/lib/utils';

interface ApiStatusCardProps {
  apiStatus: ApiStatus;
  onRefresh: () => void;
  loading: boolean;
}

const ApiStatusCard = ({ apiStatus, onRefresh, loading }: ApiStatusCardProps) => {
  const getStatusIcon = () => {
    switch (apiStatus.status) {
      case 'online':
        return <Wifi className="h-8 w-8 text-farm-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      case 'offline':
        return <WifiOff className="h-8 w-8 text-destructive" />;
    }
  };

  const getStatusColor = () => {
    switch (apiStatus.status) {
      case 'online':
        return 'bg-farm-green-100 text-farm-green-700 border-farm-green-200';
      case 'degraded':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'offline':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getResponseTimeColor = () => {
    if (apiStatus.responseTime < 300) return 'text-farm-green-500';
    if (apiStatus.responseTime < 1000) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">ThingSpeak API Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <Badge className={cn("capitalize", getStatusColor())}>
                {apiStatus.status}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Last checked: {new Date(apiStatus.lastCheck).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Response Time</span>
            <span className={cn("text-xl font-bold", getResponseTimeColor())}>
              {apiStatus.responseTime} ms
            </span>
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="ml-auto"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiStatusCard;
