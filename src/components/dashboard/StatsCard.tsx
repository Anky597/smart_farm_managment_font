
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  delta?: number;
  loading: boolean;
}

const StatsCard = ({ title, value, unit, delta = 0, loading }: StatsCardProps) => {
  const getDeltaIcon = () => {
    if (delta > 0) return <ArrowUp className="h-4 w-4 text-farm-green-500" />;
    if (delta < 0) return <ArrowDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getDeltaText = () => {
    if (delta > 0) return `+${delta.toFixed(1)}${unit} vs previous`;
    if (delta < 0) return `${delta.toFixed(1)}${unit} vs previous`;
    return `No change vs previous`;
  };

  return (
    <Card className={cn("data-card", loading && "animate-pulse-slow")}>
      <CardHeader className="pb-1">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-bold">
            {loading ? "--" : `${value}${unit}`}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {loading ? 
              <div className="h-4 w-24 bg-muted rounded"></div> : 
              (
                <>
                  {getDeltaIcon()}
                  <span>{getDeltaText()}</span>
                </>
              )
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
