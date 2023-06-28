import React, { useState } from 'react';
import api from './api';
import axios from 'axios';
import DataPreview from './DataPreview';
import StateSelector from './StateSelector';
import FileInput from './FileInput';
import './CSS/FileSelect.css';

axios.defaults.baseURL = 'http://localhost:3000';

const FileSelect = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [selectedState, setSelectedState] = useState('OH');

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      setErrorMessage('');
    } else {
      setSelectedFile(null);
      setErrorMessage('');
    }
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('state', selectedState);

      try {
        const response = await api.post('/service_delivery_points/preview', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setPreviewData(response.data);
        if (onFileSelect) {
          onFileSelect(selectedFile, selectedState);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('There was an error processing your request.');
      }
    }
  };

  return (
    <div className="file-select">
      {previewData ? (
        <>
          <DataPreview data={previewData} />
        </>
      ) : (
        <form className="file-select__form" onSubmit={handleSubmit}>
          <div className="file-select__container">
            <div className="file-select__visualization-options"></div>
            <StateSelector 
              selectedState={selectedState} 
              onStateChange={handleStateChange} 
            />
            <FileInput 
              selectedFile={selectedFile}
              onFileSelect={handleFileChange}
            />
            <div className="file-select__error-message">{errorMessage}</div>
            <button className="file-select__submit-button" type="submit">
              Upload
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FileSelect;
