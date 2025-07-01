export interface ImageGenerationRequest {
  prompt: string;
  resolution: string;
  model: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl: string;
  prompt: string;
  resolution: string;
  model: string;
  taskUUID?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  resolution: string;
  model: string;
  timestamp: string;
  taskUUID?: string;
  isFavorite?: boolean;
  isPublic?: boolean;
}


export class ImageGenerationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ImageGenerationError';
  }
}

export async function generateImage({
  prompt,
  resolution,
  model,
}: ImageGenerationRequest): Promise<GeneratedImage> {
  try {
    const response = await fetch('/api/runware', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, resolution, model }),
    });

    const text = await response.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new ImageGenerationError('Invalid JSON returned from API', text);
    }

    if (!response.ok) {
      throw new ImageGenerationError(data?.error || 'API Error', data?.details || text);
    }

    if (!data.imageUrl) {
      throw new ImageGenerationError('No image returned from API', data);
    }

    return {
      id: crypto.randomUUID(),
      url: data.imageUrl,
      prompt,
      resolution,
      model,
      timestamp: new Date().toISOString(),
      taskUUID: data.taskUUID || null,
    };

  } catch (err: any) {
    if (err instanceof ImageGenerationError) {
      throw err;
    }
    throw new ImageGenerationError('Unexpected error', err.message || err);
  }
}

export function downloadImage(url: string, prompt: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = prompt.replace(/\s+/g, '_') + '.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const AVAILABLE_MODELS = [
  {
    id: 'runware:100@1',
    name: 'Runware Base Model',
    description: 'Standard model provided by Runware for general purpose image generation',
  },
];

export const AVAILABLE_RESOLUTIONS = [
  { id: '512x512', name: 'Square', aspectRatio: '1:1' },
  { id: '768x512', name: 'Landscape', aspectRatio: '3:2' },
  { id: '512x768', name: 'Portrait', aspectRatio: '2:3' },
];

// ✅ Tailwind class merger utility
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
