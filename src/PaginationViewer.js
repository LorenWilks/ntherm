import React, { useState } from 'react';
import { Input, Button, Segment } from 'semantic-ui-react';
import './CSS/PaginationViewer.css'

function PaginationViewer({ totalPages, onPageChange }) {
  const [pageNumber, setPageNumber] = useState('');

  const handleGoToPage = () => {
    const parsedPageNumber = parseInt(pageNumber);
    if (!isNaN(parsedPageNumber) && parsedPageNumber >= 1 && parsedPageNumber <= totalPages) {
      onPageChange(parsedPageNumber);
    }
  };

  return (
    <Segment classname="monkey">
      <div className="total-pages">Total Pages: {totalPages}</div>
      <div className="go-to-page">
        <label>Go To Page:</label>
        <Input
          type="integer"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
          placeholder="Enter page number"
          min="1"
          max={totalPages}
        />
        <Button primary onClick={handleGoToPage}>
          Go
        </Button>
      </div>
    </Segment>
  );
}

export default PaginationViewer;
