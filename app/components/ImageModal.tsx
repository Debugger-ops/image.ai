'use client';
import React from 'react';
import './ImageModal.css';
import { X, Heart, Download, Trash2, Calendar, Sparkles, Copy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { GeneratedImage } from '../types/Image';

interface ImageModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDeleteImage: (id: string) => void;
  onDownloadImage: (url: string, prompt: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onToggleFavorite,
  onDeleteImage,
  onDownloadImage,
}) => {
  const handleFavorite = () => {
    onToggleFavorite(image.id);
    toast.success(image.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleDelete = () => {
    onDeleteImage(image.id);
    onClose();
    toast.success('Image deleted');
  };

  const handleDownload = () => {
    onDownloadImage(image.url, image.prompt);
    toast.success('Download started');
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success('Prompt copied to clipboard');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="image-modal-overlay">
      <div className="image-modal-container">
        <div className="image-modal-header">
          <h2>Image Details</h2>
          <Button onClick={onClose} className="prompt-copy-btn">
            <X />
          </Button>
        </div>

        <div className="image-modal-body">
          <div className="image-section">
            <div className="image-wrapper">
              <img src={image.url} alt={image.prompt} />
              {image.isFavorite && (
                <div className="favorite-badge">
                  <Heart />
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <div className="section">
              <div className="section-title">
                <Sparkles />
                <h3>Prompt</h3>
              </div>
              <div className="prompt-wrapper">
                <p className="prompt-box">{image.prompt}</p>
                <Button onClick={handleCopyPrompt} className="prompt-copy-btn">
                  <Copy />
                </Button>
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">Details</h3>
              <div className="meta-info">
                <div>
                  <Calendar /> {formatDate(image.timestamp)}
                </div>
                <div className="tags">
                  <span className={`tag ${image.isPublic ? 'public' : 'private'}`}>
                    {image.isPublic ? 'Public' : 'Private'}
                  </span>
                  {image.isFavorite && <span className="tag favorite">Favorite</span>}
                </div>
              </div>
            </div>

            <div className="actions">
              <h3 className="section-title">Actions</h3>
              <div className="action-buttons">
                <Button onClick={handleFavorite} className="button-favorite">
                  <Heart className={image.isFavorite ? 'fill-current text-pink-400' : ''} />
                  {image.isFavorite ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button onClick={handleDownload} className="button-download">
                  <Download />
                  Download
                </Button>
              </div>
              <Button onClick={handleDelete} className="button-delete">
                <Trash2 />
                Delete Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
