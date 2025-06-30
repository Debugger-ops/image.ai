import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Download,
  Trash2,
  Plus,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import ImageGenerator from '../components/ImageGenerator';
import ImageGallery from '../components/ImageGallery';
import { GeneratedImage } from '../types/Image';
import './Index.css';

const Index = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageGenerated = (newImage: GeneratedImage) => {
    setImages(prev => [newImage, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
      )
    );
  };

  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDownloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${prompt.slice(0, 20).replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="background-animation">
        <div className="blobs-container">
          <div className="blob purple"></div>
          <div className="blob pink"></div>
          <div className="blob blue"></div>
        </div>
      </div>

      <div className="content">
        <header className="header">
          <div className="header-inner">
            <div className="branding">
              <div className="logo-gradient">
                <Sparkles className="icon-white" />
              </div>
              <div>
                <h1 className="title">Artify</h1>
                <p className="subtitle">AI-Powered Image Gallery</p>
              </div>
            </div>
            <div className="stats">
              <div className="stat">
                <ImageIcon className="icon-small" />
                <span>{images.length} Images</span>
              </div>
              <div className="stat">
                <Heart className="icon-pink" />
                <span>{images.filter(img => img.isFavorite).length} Favorites</span>
              </div>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="generator-section">
            <div className="generator-box">
              <div className="generator-header">
                <Zap className="icon-yellow" />
                <h2 className="section-title">Generate New Art</h2>
              </div>
              <ImageGenerator
                onImageGenerated={handleImageGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>
          </div>

          <div className="gallery-section">
            <div className="gallery-header">
              <h2 className="section-title">
                <ImageIcon className="icon-purple" />
                <span>Your Gallery</span>
              </h2>
              {images.length > 0 && (
                <div className="favorite-count">
                  {images.filter(img => img.isFavorite).length > 0 && (
                    <span className="favorite-badge">
                      {images.filter(img => img.isFavorite).length} favorited
                    </span>
                  )}
                </div>
              )}
            </div>

            {images.length === 0 ? (
              <div className="empty-gallery">
                <div className="empty-box">
                  <div className="empty-icon">
                    <Plus className="icon-large" />
                  </div>
                  <h3 className="empty-title">No images yet</h3>
                  <p className="empty-description">Create your first AI-generated masterpiece using the generator above!</p>
                  <div className="inspiration">
                    <Sparkles className="icon-small" />
                    <span>Let your imagination run wild</span>
                  </div>
                </div>
              </div>
            ) : (
              <ImageGallery
                images={images}
                onToggleFavorite={handleToggleFavorite}
                onDeleteImage={handleDeleteImage}
                onDownloadImage={handleDownloadImage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
