
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  X,
  RefreshCw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { predictDisease } from '@/services/api';
import { cn } from '@/lib/utils';

const DiseaseDetection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{
    class: string;
    confidence: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    setProgress(0);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      const result = await predictDisease(selectedImage);
      setPrediction({
        class: result.prediction.predicted_class.replace(/_/g, ' '),
        confidence: Math.round(result.prediction.confidence * 100),
      });
      setProgress(100);
      toast.success('Successfully analyzed image');
    } catch (error) {
      console.error('Error predicting disease:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to analyze image. Please try again.';
      if (error instanceof Error) {
        errorMessage += ` (${error.message})`;
      }
      
      toast.error(errorMessage);
      setPrediction(null);
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Disease Detection</h1>
        <p className="text-muted-foreground">
          AI-powered plant disease detection and diagnosis
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Upload Plant Image
            </CardTitle>
            <CardDescription>
              Upload a clear image of the affected plant part for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4 gap-4">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 w-full flex flex-col items-center justify-center gap-4 relative transition-all duration-200",
                  previewUrl 
                    ? "border-primary/40 bg-primary/5 hover:bg-primary/10" 
                    : "border-muted-foreground/20 hover:border-primary/30"
                )}
              >
                {previewUrl ? (
                  <div className="relative w-full aspect-square">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="rounded-lg object-contain w-full h-full"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      onClick={handleClear}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium text-muted-foreground">
                        Drag and drop plant images here
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        or click to browse files
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
                    </Button>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {isAnalyzing && (
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Analyzing image...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedImage || isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Analyze Image
                    </>
                  )}
                </Button>
                
                {selectedImage && !isAnalyzing && (
                  <Button
                    variant="outline"
                    onClick={handleClear}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t px-6 py-4">
            <h4 className="text-sm font-medium mb-2">For best results:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
              <li>Use clear, well-lit images</li>
              <li>Focus on the affected area</li>
              <li>Include multiple angles if possible</li>
              <li>Avoid blurry or dark photos</li>
            </ul>
          </CardFooter>
        </Card>

        <div className="md:col-span-1">
          {prediction ? (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Detection Results
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of the plant disease
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-muted/50 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Detected Disease</h3>
                      <p className="text-2xl font-bold text-primary">{prediction.class}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Confidence Level</h3>
                      <div className="flex items-center gap-2">
                        <Progress value={prediction.confidence} className="h-2 flex-1" />
                        <span className="font-medium">{prediction.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Recommended Actions</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="rounded-full p-1 bg-amber-100 text-amber-700 mt-0.5">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <p className="text-muted-foreground">Isolate affected plants to prevent spread</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full p-1 bg-amber-100 text-amber-700 mt-0.5">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <p className="text-muted-foreground">Remove and dispose of severely infected plant parts</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full p-1 bg-amber-100 text-amber-700 mt-0.5">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <p className="text-muted-foreground">Consider appropriate fungicides or treatments specific to this disease</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col justify-center items-center p-8 bg-muted/50">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                <h3 className="text-lg font-medium">No Analysis Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Upload a plant image and click "Analyze Image" to receive a detailed disease detection with confidence score.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default DiseaseDetection;
