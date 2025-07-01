// app/components/ImageGenerator.tsx
'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Wand2, Download, Settings } from 'lucide-react';
import { 
  generateImage, 
  ImageGenerationError, 
  AVAILABLE_MODELS, 
  AVAILABLE_RESOLUTIONS,
  downloadImage,
  type GeneratedImage 
} from '../lib/utils';
import './ImageGenerator.css';

interface ImageGeneratorProps {
  onImageGenerated?: (image: GeneratedImage) => void;
}

export default function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState('512x512');
  const [model, setModel] = useState('runware:100@1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const image = await generateImage({
        prompt: prompt.trim(),
        resolution,
        model
      });

      setGeneratedImage(image);
      onImageGenerated?.(image);
      
    } catch (err) {
      console.error('Generation failed:', err);
      
      if (err instanceof ImageGenerationError) {
        setError(err.message);
        if (err.details) {
          console.error('Error details:', err.details);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage.url, generatedImage.prompt);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="image-generator">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Wand2 className="icon" /> AI Image Generator
          </h2>
          <p className="card-description">Create stunning images from text descriptions using AI</p>
        </div>

        <div className="card-content">
          <div className="form-group">
            <label htmlFor="prompt">Describe your image</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="A serene mountain landscape at sunset with purple clouds..."
              className="textarea"
              rows={3}
              disabled={isGenerating}
            />
            <p className="hint">Press Enter to generate • Shift+Enter for new line</p>
          </div>

          <div className="advanced-settings">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="toggle-advanced"
            >
              <Settings className="icon" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {showAdvanced && (
              <div className="advanced-panel">
                <div className="form-group">
                  <label htmlFor="resolution">Resolution</label>
                  <select
                    id="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    disabled={isGenerating}
                  >
                    {AVAILABLE_RESOLUTIONS.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.name} ({res.aspectRatio})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="model">Model</label>
                  <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={isGenerating}
                  >
                    {AVAILABLE_MODELS.map((mdl) => (
                      <option key={mdl.id} value={mdl.id}>
                        {mdl.name}
                      </option>
                    ))}
                  </select>
                  <p className="hint">
                    {AVAILABLE_MODELS.find(m => m.id === model)?.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="generate-button"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="icon spin" /> Generating...
              </>
            ) : (
              <>
                <Wand2 className="icon" /> Generate Image
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {generatedImage && (
            <div className="generated-card">
              <div className="generated-content">
                <div className="image-preview">
                  <img
                    src={generatedImage.url}
                    alt={generatedImage.prompt}
                    className="generated-img"
                  />
                  <div className="image-overlay">
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      size="sm"
                      className="download-btn"
                    >
                      <Download className="icon" /> Download
                    </Button>
                  </div>
                </div>
                <div className="prompt-info">
                  <p className="label">Prompt:</p>
                  <p className="prompt-text">{generatedImage.prompt}</p>
                  <div className="meta">
                    <span>Resolution: {generatedImage.resolution}</span>
                    <span>Model: {AVAILABLE_MODELS.find(m => m.id === generatedImage.model)?.name || generatedImage.model}</span>
                    {generatedImage.taskUUID && (
                      <span>ID: {generatedImage.taskUUID.slice(-8)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
