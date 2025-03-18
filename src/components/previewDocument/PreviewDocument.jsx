import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadDocument } from '../../services/operations/authAPI';
import './PreviewDocument.css';

const PreviewDocument = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const { image } = location.state || {};

  const [blurredImage, setBlurredImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const handleUpload = async () => {
      if (image) {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];

            const response = await fetch('http://localhost:8081/blur', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: base64Image,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              setBlurredImage(data.blurredImage); // Set the blurred image
            } else {
              const errorData = await response.json();
              setErrorMessage(errorData.error || 'Failed to process the image. Please try again.');
            }
            setIsLoading(false);
          };

          reader.readAsDataURL(image);
        } catch (error) {
          console.error('Upload failed:', error);
          setErrorMessage('An error occurred while processing the image.');
          setIsLoading(false);
        }
      }
    };

    handleUpload();
  }, [image]);

  const uploadBlurredImage = useCallback(async () => {
    if (blurredImage) {
      const blurredImageBlob = await fetch(`data:image/png;base64,${blurredImage}`).then(res => res.blob());
      await dispatch(uploadDocument(blurredImageBlob, token));
      navigate('/');
    }
  }, [blurredImage, dispatch, navigate, token]);

  useEffect(() => {
    if (blurredImage) {
      const timer = setTimeout(() => {
        uploadBlurredImage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [blurredImage, uploadBlurredImage]);

  return (
    <div>
      <div className="container">
        <div className="image-blur-selector">
          <div className="preview-section">
            <h2>Preview Image</h2>
            <div className="image-placeholder">
              {/* Display the blurred image if available, otherwise display the original image */}
              {blurredImage ? (
                <img src={`data:image/png;base64,${blurredImage}`} alt="Blurred Preview" />
              ) : (
                image && <img src={URL.createObjectURL(image)} alt="Original Preview" />
              )}
              {isLoading && <div className="loading-animation"></div>} {/* Rotating circle loading animation */}
            </div>
            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewDocument;