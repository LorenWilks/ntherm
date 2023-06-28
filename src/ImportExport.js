import React from 'react';
import { Button } from 'semantic-ui-react';
import './CSS/ImportExport.css';

const ImportExport = ({ onImport, onExport, onAppend }) => {
  const handleAppend = () => {
    console.log('Clicked on Append button');
    onAppend();
  };  
  

  return (
    <div className="import-export-container">
      <Button primary onClick={onImport}>
        Upload
      </Button>
      <Button onClick={onExport}>
        Export
      </Button>
      <Button onClick={handleAppend}>
        Append Phone Numbers
      </Button>
    </div>
  );
};

export default ImportExport;
