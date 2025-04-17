
export interface CropPredictionRequest {
  Temperature: number;
  Humidity: number;
  Moisture: number;
  "Soil Type": string;
  Nitrogen: number;
  Potassium: number;
  Phosphorus: number;
}

export interface CropPredictionResponse {
  predicted_crop: string;
  status: string;
}

export interface DiseasePredictionResponse {
  prediction: {
    confidence: number;
    predicted_class: string;
    predicted_index: number;
  };
  status: string;
}

export interface LLMDiseaseAnalysisResponse {
  analysis: string;
  status: string;
}

const API_BASE_URL = 'https://ankys-capstone-backend.hf.space';

export async function predictCrop(data: CropPredictionRequest): Promise<CropPredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict_crop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function predictDisease(imageFile: File): Promise<DiseasePredictionResponse> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch(`${API_BASE_URL}/predict_disease`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function analyzeDiseaseWithLLM(imageFile: File): Promise<LLMDiseaseAnalysisResponse> {
  const formData = new FormData();
  formData.append('imagefile', imageFile); // Changed from 'file' to 'imagefile' to match backend expectation

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
