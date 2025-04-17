
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
                  <li>Data-driven crop recommendations based on soil and climate conditions</li>
                  <li>AI-powered plant disease detection using image analysis</li>
                  <li>Comprehensive reporting and analytics</li>
                  <li>Mobile-responsive design for field access</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Getting Started</h3>
                <p className="text-muted-foreground">
                  Begin by exploring the Dashboard to see your current farm conditions. From there, you can navigate 
                  to the specific tools you need: Crop Recommendation for planting guidance, Disease Detection to 
                  identify plant diseases, and Reports for historical data analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Dashboard Guide
              </CardTitle>
              <CardDescription>
                Understanding the farm dashboard and its components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Dashboard provides a complete overview of your farm's current conditions. It displays real-time 
                sensor data, including temperature, humidity, and soil moisture levels across different field sections.
              </p>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Main Components</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Status Cards:</strong> Show the current conditions of each field section</li>
                  <li><strong>API Status Card:</strong> Indicates the connection status to your sensor network</li>
                  <li><strong>Stat Cards:</strong> Display average readings for temperature, humidity, and soil moisture</li>
                  <li><strong>Sensor Line Chart:</strong> Visualizes data trends over time</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Refreshing Data</h3>
                <p className="text-muted-foreground">
                  Data is automatically refreshed every 5 minutes. You can also manually refresh the data using the 
                  "Refresh Data" button in the top-right corner of the dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Crop Recommendation System
              </CardTitle>
              <CardDescription>
                How to use the crop recommendation tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Crop Recommendation system analyzes your soil and climate conditions to suggest the most suitable 
                crops for planting. This data-driven approach helps optimize yield and resource utilization.
              </p>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Using the Tool</h3>
                <p className="text-muted-foreground">
                  Simply input your soil parameters like nitrogen content, phosphorus level, potassium level, and pH. 
                  The system will also use your location's climate data to generate personalized crop recommendations.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Interpreting Results</h3>
                <p className="text-muted-foreground">
                  The recommendations are presented with confidence scores and additional information about each crop's 
                  ideal growing conditions. Use this information to make informed decisions about crop selection and rotation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diseases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Disease Detection Guide
              </CardTitle>
              <CardDescription>
                How to identify plant diseases using the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our Disease Detection system uses advanced image recognition to identify common plant diseases. Early 
                detection allows for prompt treatment, minimizing crop loss and reducing pesticide usage.
              </p>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Image Submission</h3>
                <p className="text-muted-foreground">
                  Take clear photos of affected plant parts (leaves, stems, fruit) and upload them through the Disease 
                  Detection interface. For best results, ensure good lighting and focus on the affected areas.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Analysis and Treatment</h3>
                <p className="text-muted-foreground">
                  The system will analyze the images and provide a diagnosis with recommended treatment options. 
                  The LLM Disease Detection feature offers more detailed analysis for complex cases.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions and answers about the FarmSense platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">How often is sensor data updated?</h3>
                  <p className="text-muted-foreground">
                    Sensor data is automatically refreshed every 5 minutes. You can also manually refresh the data 
                    using the "Refresh Data" button on the dashboard.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-1">Can I export reports and data?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can export data from the Reports page in CSV format for further analysis or record-keeping.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-1">How accurate is the disease detection system?</h3>
                  <p className="text-muted-foreground">
                    Our system has been trained on thousands of images and can identify most common crop diseases with 
                    over 90% accuracy. For unusual cases, the LLM-based analysis provides additional insights.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-1">What should I do if the sensors go offline?</h3>
                  <p className="text-muted-foreground">
                    Check the physical sensors and their connections. The API Status card on the dashboard will show 
                    the connection status. If problems persist, contact support for assistance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-1">Can I add more sensors to my account?</h3>
                  <p className="text-muted-foreground">
                    Yes, additional sensors can be integrated into your account. Contact our support team for assistance 
                    with hardware setup and configuration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
