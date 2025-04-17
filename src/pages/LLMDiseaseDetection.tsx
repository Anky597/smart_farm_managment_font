
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Info, 
  AlertTriangle, 
  X,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { analyzeDiseaseWithLLM } from '@/services/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const LLMDiseaseDetection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
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
      setAnalysis(null);
    }
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
      console.log('Sending image to analyze endpoint with filename:', selectedImage.name);
      
      const result = await analyzeDiseaseWithLLM(selectedImage);
      setAnalysis(result.analysis);
      setProgress(100);
      toast.success('Analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing disease:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to analyze image. Please try again.';
      if (error instanceof Error) {
        errorMessage += ` (${error.message})`;
      }
      
      toast.error(errorMessage);
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setProgress(0);
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**')) {
        const cleanLine = line.replace(/\*\*/g, '');
        return <h3 key={index} className="font-semibold text-lg mt-4 mb-2">{cleanLine}</h3>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Disease Analysis</h1>
        <p className="text-muted-foreground">
          Advanced plant disease analysis powered by AI
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
          {analysis ? (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  Detailed analysis of the plant disease and treatment recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="prose prose-sm dark:prose-invert">
                    {formatAnalysis(analysis)}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col justify-center items-center p-8 bg-muted/50">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                <h3 className="text-lg font-medium">No Analysis Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Upload a plant image and click "Analyze Image" to receive a detailed disease analysis and treatment recommendations.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default LLMDiseaseDetection;
