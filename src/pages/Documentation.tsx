
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Leaf, 
  AlertCircle, 
  BarChart2,
  Settings,
  HelpCircle
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          Learn how to use the FarmSense platform and its features
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="crops">Crop Recommendation</TabsTrigger>
          <TabsTrigger value="diseases">Disease Detection</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Welcome to FarmSense
              </CardTitle>
              <CardDescription>
                A comprehensive platform for smart agriculture management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">About FarmSense</h3>
                <p className="text-muted-foreground">
                  FarmSense is an integrated solution for modern farmers, providing real-time sensor data monitoring, 
                  crop recommendation systems, and plant disease detection. Our platform helps farmers make informed 
                  decisions to maximize yield and reduce crop loss.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Real-time monitoring of temperature, humidity, and soil moisture</li>
                  <li>AI-powered crop recommendation based on soil and climate conditions</li>
                  <li>Plant disease detection using image recognition</li>
                  <li>Advanced disease analysis with AI</li>
                  <li>Historical data reporting and visualization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab contents remain the same */}
      </Tabs>
    </div>
  );
};

export default Documentation;
