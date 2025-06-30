'use client';
import React, { useState } from 'react';
import { Heart, Download, Trash2, Eye, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { GeneratedImage } from '../types/Image';
import ImageModal from './ImageModal';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onToggleFavorite: (id: string) => void;
  onDeleteImage: (id: string) => void;
  onDownloadImage: (url: string, prompt: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onToggleFavorite,
  onDeleteImage,
  onDownloadImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredImages = filter === 'favorites' 
    ? images.filter(img => img.isFavorite)
    : images;

  const handleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(id);
    toast.success('Updated favorites');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteImage(id);
    toast.success('Image deleted');
  };

  const handleDownload = (url: string, prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDownloadImage(url, prompt);
    toast.success('Download started');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="filter-tabs">
        <button
          onClick={() => setFilter('all')}
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
        >
          All Images ({images.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`filter-button favorites ${filter === 'favorites' ? 'active' : ''}`}
        >
          <Heart className="icon" />
          <span>Favorites ({images.filter(img => img.isFavorite).length})</span>
        </button>
      </div>

      <div className="gallery-grid">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="gallery-card"
            onClick={() => setSelectedImage(image)}
          >
            <div className="image-container">
              <img
                src={image.url}
                alt={image.prompt}
                className="gallery-image"
              />

              <div className="image-overlay">
                <div className="overlay-content">
                  <Eye className="icon" />
                  <span className="overlay-text">View Details</span>
                </div>
              </div>

              {image.isFavorite && (
                <div className="favorite-badge">
                  <Heart className="icon-filled" />
                </div>
              )}

              <div className="action-buttons">
                <Button
                  size="sm"
                  variant="secondary"
                  className="action-btn"
                  onClick={(e) => handleFavorite(image.id, e)}
                >
                  <Heart className={`icon ${image.isFavorite ? 'pink' : 'white'}`} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="action-btn"
                  onClick={(e) => handleDownload(image.url, image.prompt, e)}
                >
                  <Download className="icon white" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="action-btn delete"
                  onClick={(e) => handleDelete(image.id, e)}
                >
                  <Trash2 className="icon red" />
                </Button>
              </div>
            </div>

            <div className="image-info">
              <div className="prompt">
                <Sparkles className="icon purple" />
                <p className="prompt-text">{image.prompt}</p>
              </div>
              <div className="info-footer">
                <div className="timestamp">
                  <Calendar className="icon tiny" />
                  <span>{formatDate(image.timestamp)}</span>
                </div>
                {image.isPublic && (
                  <span className="public-badge">Public</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && filter === 'favorites' && (
        <div className="empty-favorites">
          <div className="empty-box">
            <Heart className="icon-large pink" />
            <h3 className="empty-title">No favorites yet</h3>
            <p className="empty-description">
              Click the heart icon on images to add them to your favorites
            </p>
          </div>
        </div>
      )}

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onToggleFavorite={onToggleFavorite}
          onDeleteImage={onDeleteImage}
          onDownloadImage={onDownloadImage}
        />
      )}
    </>
  );
};

export default ImageGallery;
