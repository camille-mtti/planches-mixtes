import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Upload, message, Image, Card, Space, Typography } from 'antd';
import { UploadOutlined, DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../libs/firebase/firebase';

const { Text } = Typography;

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onPrimaryImageChange: (primaryImage: string | null) => void;
  primaryImage?: string | null;
  maxImages?: number;
}

interface ImageItem {
  url: string;
  isPrimary: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  onPrimaryImageChange,
  primaryImage,
  maxImages = 10
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadToFirebase = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `planche_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `planches/${fileName}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload image');
    }
  };

  const deleteFromFirebase = async (url: string) => {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      message.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = acceptedFiles.map(file => uploadToFirebase(file));
      const newUrls = await Promise.all(uploadPromises);
      
      const updatedImages = [...images, ...newUrls];
      onImagesChange(updatedImages);
      
      // Set first image as primary if no primary is set
      if (!primaryImage && newUrls.length > 0) {
        onPrimaryImageChange(newUrls[0]);
      }
      
      message.success(`${newUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      message.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, primaryImage, onImagesChange, onPrimaryImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    disabled: uploading || images.length >= maxImages
  });

  const handleDeleteImage = async (urlToDelete: string) => {
    try {
      await deleteFromFirebase(urlToDelete);
      const updatedImages = images.filter(url => url !== urlToDelete);
      onImagesChange(updatedImages);
      
      // If deleted image was primary, set new primary
      if (primaryImage === urlToDelete) {
        const newPrimary = updatedImages.length > 0 ? updatedImages[0] : null;
        onPrimaryImageChange(newPrimary);
      }
      
      message.success('Image deleted successfully');
    } catch (error) {
      message.error('Failed to delete image');
    }
  };

  const handleSetPrimary = (url: string) => {
    onPrimaryImageChange(url);
    message.success('Primary image updated');
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #d9d9d9',
          borderRadius: '6px',
          padding: '20px',
          textAlign: 'center',
          cursor: uploading || images.length >= maxImages ? 'not-allowed' : 'pointer',
          opacity: uploading || images.length >= maxImages ? 0.6 : 1,
          backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa'
        }}
      >
        <input {...getInputProps()} />
        <UploadOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
        <div style={{ marginTop: '8px' }}>
          {isDragActive ? (
            <Text>Drop images here...</Text>
          ) : (
            <Text>
              {uploading ? 'Uploading...' : `Drag & drop images here, or click to select (${images.length}/${maxImages})`}
            </Text>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <Text strong>Uploaded Images ({images.length}):</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '8px' }}>
            {images.map((url, index) => (
              <Card
                key={url}
                size="small"
                style={{ position: 'relative' }}
                cover={
                  <Image
                    src={url}
                    alt={`Planche image ${index + 1}`}
                    style={{ height: '150px', objectFit: 'cover' }}
                    preview={true}
                  />
                }
                actions={[
                  <Button
                    key="primary"
                    type={primaryImage === url ? 'primary' : 'default'}
                    icon={primaryImage === url ? <StarFilled /> : <StarOutlined />}
                    onClick={() => handleSetPrimary(url)}
                    size="small"
                  >
                    {primaryImage === url ? 'Primary' : 'Set Primary'}
                  </Button>,
                  <Button
                    key="delete"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteImage(url)}
                    size="small"
                  >
                    Delete
                  </Button>
                ]}
              >
                <Card.Meta
                  title={primaryImage === url ? 'Primary Image' : `Image ${index + 1}`}
                  description={primaryImage === url ? 'This is the main image' : 'Click to set as primary'}
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
