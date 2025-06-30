
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
  isFavorite: boolean;
  isPublic: boolean;
}

export interface ImageGenerationParams {
  prompt: string;
  width?: number;
  height?: number;
  model?: string;
  steps?: number;
}
