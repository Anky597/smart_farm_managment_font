import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Leaf, Sprout } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { predictCrop } from '@/services/api';

// Define schema for form validation
const formSchema = z.object({
  temperature: z.coerce.number().min(0).max(50),
  humidity: z.coerce.number().min(0).max(100),
  moisture: z.coerce.number().min(0).max(100),
  nitrogen: z.coerce.number().min(0).max(150),
  potassium: z.coerce.number().min(0).max(150),
  phosphorus: z.coerce.number().min(0).max(150),
  soilType: z.enum(['Sandy', 'Loamy', 'Black', 'Clayey', 'Red']),
});

type FormValues = z.infer<typeof formSchema>;

const soilTypes = ['Sandy', 'Loamy', 'Black', 'Clayey', 'Red'];

const CropRecommendation = () => {
  const [recommendedCrop, setRecommendedCrop] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperature: 0,
      humidity: 0,
      moisture: 0,
      nitrogen: 0,
      potassium: 0,
      phosphorus: 0,
      soilType: 'Black',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsAnalyzing(true);
    try {
      const response = await predictCrop({
        Temperature: data.temperature,
        Humidity: data.humidity,
        Moisture: data.moisture,
        "Soil Type": data.soilType,
        Nitrogen: data.nitrogen,
        Potassium: data.potassium,
        Phosphorus: data.phosphorus,
      });
      
      setRecommendedCrop(response.predicted_crop);
      toast.success('Successfully analyzed soil data');
    } catch (error) {
      console.error('Error predicting crop:', error);
      toast.error('Failed to analyze soil data. Please try again.');
      setRecommendedCrop(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Crop Recommendation</h1>
        <p className="text-muted-foreground">
          AI-powered crop recommendation based on your farm data
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Soil & Environment Analysis
            </CardTitle>
            <CardDescription>
              Enter your soil and environmental data to get a personalized crop recommendation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 34" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="humidity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Humidity (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="moisture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moisture (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 23" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nitrogen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nitrogen (kg/ha)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 56" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="potassium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potassium (kg/ha)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 89" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phosphorus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phosphorus (kg/ha)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 78" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {soilTypes.map((soil) => (
                            <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Get Recommendation'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Recommendation Result
            </CardTitle>
            <CardDescription>
              Your recommended crop based on soil and environmental conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedCrop ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-primary/10 p-5 rounded-full mb-4">
                  <Sprout className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{recommendedCrop}</h3>
                <p className="text-muted-foreground max-w-md">
                  Based on your input data, we recommend growing {recommendedCrop} in your field.
                  This crop is well-suited for your soil type and environmental conditions.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 h-[280px] text-center">
                <div className="bg-muted/50 p-5 rounded-full mb-4">
                  <Leaf className="h-12 w-12 text-muted-foreground/70" />
                </div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Recommendation Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Fill out the form with your soil and environmental data to get a personalized crop recommendation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CropRecommendation;
