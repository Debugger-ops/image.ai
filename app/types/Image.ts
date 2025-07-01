
// ✅ Import the type explicitly (required for using it directly in this file)
import type { 
  GeneratedImage, 
  ImageGenerationRequest, 
  ImageGenerationResponse, 
  ApiError 
} from '../lib/utils';

// ✅ Re-export for other files to use
export type {
  GeneratedImage,
  ImageGenerationRequest,
  ImageGenerationResponse,
  ApiError
};

// ✅ Your interfaces that reference GeneratedImage
export interface ImageGalleryItem extends GeneratedImage {
  isLoading?: boolean;
  error?: string;
}

export interface ImageModalProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageClick?: (image: GeneratedImage) => void;
  onImageDelete?: (id: string) => void;
}
