'use client';
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Loader2, Wand2, Lightbulb, Palette, Key } from 'lucide-react';
import { toast } from 'sonner';
import { GeneratedImage } from '../types/Image';
import './ImageGenerator.css';

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  onImageGenerated,
  isGenerating,
  setIsGenerating,
}) => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const examplePrompts = [
    "A serene mountain landscape at sunset with purple clouds",
    "A futuristic city with neon lights and flying cars",
    "A magical forest with glowing mushrooms and fairy lights",
    "A steampunk mechanical dragon in a Victorian workshop",
    "An underwater coral reef city with bioluminescent creatures"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !apiKey.trim()) {
      toast.error("Prompt and API key are required.");
      return;
    }

    setIsGenerating(true);

    const params = {
      prompt: prompt.trim(),
    };

    try {
      const response = await fetch("https://api.runware.ai/v1/images/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Runware API error:", data);
        toast.error(`Image generation failed: ${data.errors?.[0] || response.statusText}`);
        return;
      }

      const imageUrl = data?.images?.[0]?.url;
      const id = data?.images?.[0]?.id ?? crypto.randomUUID();

      if (imageUrl) {
        const generatedImage: GeneratedImage = {
          id,
          url: imageUrl,
          prompt,
          timestamp: new Date().toISOString(),
          isFavorite: false,
          isPublic: false,
        };

        onImageGenerated(generatedImage);
        toast.success("Image generated successfully!");
      } else {
        toast.error("API did not return an image.");
      }
    } catch (error: any) {
      toast.error(`Image generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <div className="image-generator">
      {showApiKeyInput && (
        <div className="api-key-section">
          <div className="api-key-header">
            <Key className="icon small yellow" />
            <span className="label">Runware API Key Required</span>
          </div>
          <p className="hint">
            Get your API key from{" "}
            <a href="https://runware.ai/" target="_blank" rel="noopener noreferrer">
              runware.ai
            </a>
          </p>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Runware API key..."
            className="api-input"
          />
        </div>
      )}

      <div className="prompt-section">
        <div className="prompt-area">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create..."
            disabled={isGenerating}
            className="prompt-textarea"
          />
          <div className="char-counter">{prompt.length}/500</div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim() || !apiKey.trim()}
          className="generate-button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="icon spin" />
              Generating Magic...
            </>
          ) : (
            <>
              <Wand2 className="icon" />
              Generate Image
            </>
          )}
        </Button>
      </div>

      <div className="example-prompts">
        <div className="example-header">
          <Lightbulb className="icon small" />
          <span className="label">Need inspiration? Try these prompts:</span>
        </div>
        <div className="example-grid">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isGenerating}
              className="example-button"
            >
              <div className="example-item">
                <Palette className="icon purple" />
                <span>{example}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
