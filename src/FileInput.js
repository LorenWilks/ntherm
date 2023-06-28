import React from 'react';

class FileInput extends React.Component {
  fileInputRef = React.createRef();

  handleFileSelect = (event) => {
    event.preventDefault();
    this.fileInputRef.current.click();
  };

  handleFileInput = (event) => {
    const file = event.target.files[0];

    if (file) {
      this.props.onFileSelect(file);
    } else {
      this.props.onFileSelect(null);
    }
  };

  render() {
    return (
      <>
        <button 
          className="file-select__button" 
          onClick={this.handleFileSelect}>
          Choose File
        </button>
        <input
          className="file-select__input"
          type="file"
          ref={this.fileInputRef}
          onChange={this.handleFileInput}
          accept=".txt"
        />
        <div className="file-select__file-name">
          {this.props.selectedFile ? this.props.selectedFile.name : 'No file selected'}
        </div>
      </>
    )
  }
}

export default FileInput;
