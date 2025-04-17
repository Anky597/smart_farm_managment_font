
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SensorReading } from "@/services/thingspeak-api";
import { Loader2, Download } from "lucide-react";
import { format } from "date-fns";

interface ReportDataTableProps {
  data: SensorReading[];
  loading: boolean;
  onExport: () => void;
}

const ReportDataTable = ({ data, loading, onExport }: ReportDataTableProps) => {
  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead className="text-right">Temperature (°C)</TableHead>
            <TableHead className="text-right">Humidity (%)</TableHead>
            <TableHead className="text-right">Soil Moisture (%)</TableHead>
            <TableHead className="text-right">Entry ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((reading) => (
            <TableRow key={reading.entryId}>
              <TableCell>
                {format(new Date(reading.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </TableCell>
              <TableCell className="text-right">{reading.temperature}</TableCell>
              <TableCell className="text-right">{reading.humidity}</TableCell>
              <TableCell className="text-right">{reading.soilMoisture}</TableCell>
              <TableCell className="text-right">{reading.entryId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportDataTable;
