import React, { useState } from 'react';
import FileSelect from './FileSelect';
import Header from './Header';
import { Card, Dimmer, Loader, Checkbox, Button, Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import './CSS/App.css';
import PaginationViewer from './PaginationViewer';
import 'semantic-ui-css/semantic.min.css';
import ExportComponent from './ExportComponent';
import ImportExport from './ImportExport';
import AppendComponent from './AppendComponent';

const profileMappings = {
  CCOHRESA: 'Residential Class',
  CCOHNONA: 'Non-Demand Meter Class',
  CCOHDM2U: 'Demand Metered Secondary Class',
  CCOHDM2O: 'Demand Metered Secondary Class',
  CCOHDMPU: 'Demand Metered Primary Class',
  CCOHDMPO: 'Demand Metered Primary Class',
  CCOHDMTU: 'Demand Metered Subtransmission/Transmission Class',
  CCOHDMTO: 'Demand Metered Subtransmission/Transmission Class',
  CCOHLITE: 'Residential Outdoor Light & Street Light',
  CCOHFLAT: 'FLAT',
};

function App() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fileSelected, setFileSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSelected, setShowSelected] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAppend, setShowAppend] = useState(false);

  const leadsPerPage = 100;

  const toggleCheckbox = (leadId) => {
    setLeads((prevLeads) => {
      const updatedLeads = prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, isSelectedForDatabase: !lead.isSelectedForDatabase } : lead
      );
      return updatedLeads;
    });
  };

  const handleImport = () => {
    setIsExporting(false);
    setShowAppend(false);
  };

  const handleExport = () => {
    setIsExporting(true);
    setShowAppend(false);
  };

  const handleAppend = () => {
    setShowAppend(true);
    console.log(showAppend);
  };

  const deselectAll = () => {
    setLeads((prevLeads) => {
      return prevLeads.map((lead) => {
        return { ...lead, isSelectedForDatabase: false };
      });
    });
  };

  const selectAllLeads = () => {
    setLeads((prevLeads) => {
      const updatedLeads = prevLeads.map((lead) => ({ ...lead, isSelectedForDatabase: true }));
      return updatedLeads;
    });
  };

  const deselectAllFiltered = () => {
    setLeads((prevLeads) => {
      return prevLeads.map((lead) => {
        if (filteredLeads.includes(lead)) {
          return { ...lead, isSelectedForDatabase: false };
        } else {
          return lead;
        }
      });
    });
  };

  const selectAllFiltered = () => {
    setLeads((prevLeads) => {
      return prevLeads.map((lead) => {
        if (filteredLeads.includes(lead)) {
          return { ...lead, isSelectedForDatabase: true };
        } else {
          return lead;
        }
      });
    });
  };

  const toggleShowSelected = () => {
    setShowSelected((prevShowSelected) => !prevShowSelected);
  };

  const handleFileSelect = (file, state) => {
    if (file) {
      sendFileToBackend(file, state);
      setFileSelected(true);
      setIsLoading(true);
    }
  };

  const sendFileToBackend = async (file, state) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('state', state);
    try {
      const response = await axios.post('http://localhost:3000/service_delivery_points/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const leadsWithSelection = response.data.map((lead, index) => ({
        ...lead,
        id: index,
        isSelectedForDatabase: true,
      }));
      setLeads(leadsWithSelection);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event, data) => {
    setFilterTerm(data.value);
  };

  const filterOptions = [
    { key: 'default', value: '', text: 'Default' },
    { key: 'residential', value: 'CCOHRESA', text: 'Residential Class' },
    { key: 'non-demand', value: 'CCOHNONA', text: 'Non-Demand Meter Class' },
    { key: 'demand-secondary', value: 'CCOHDM2U', text: 'Demand Metered Secondary Class' },
    { key: 'demand-primary', value: 'CCOHDMPU', text: 'Demand Metered Primary Class' },
    {
      key: 'demand-subtransmission',
      value: 'CCOHDMTU',
      text: 'Demand Metered Subtransmission/Transmission Class',
    },
    { key: 'residential-light', value: 'CCOHLITE', text: 'Residential Outdoor Light & Street Light' },
    { key: 'flat', value: 'CCOHFLAT', text: 'FLAT' },
  ];

  const filteredLeads = leads
    .filter((lead) => {
      if (searchTerm === '') return true;
      const valuesToSearch = Object.values(lead).filter(
        (value) => value && typeof value === 'string' && value !== lead.profile_group
      );
      const normalizedSearchTerm = searchTerm.toLowerCase();
      return valuesToSearch.some((value) => value.toLowerCase().includes(normalizedSearchTerm));
    })
    .filter((lead) => {
      if (filterTerm === '') return true;
      return lead.profile_group === filterTerm;
    });

  const filteredAndSelectedLeads = filteredLeads.filter((lead) => lead.isSelectedForDatabase);

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = showSelected
    ? filteredAndSelectedLeads.slice(indexOfFirstLead, indexOfLastLead)
    : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const getFormattedPostalCode = (postalCode) => {
    if (postalCode) {
      return postalCode.slice(0, 5);
    }
    return '';
  };

  const submitSelectedLeads = async () => {
    const selectedLeads = leads.filter((lead) => lead.isSelectedForDatabase);

    if (selectedLeads.length === 0) {
      console.log('No leads selected.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/leads', { lead: selectedLeads });

      console.log('Response Data:', response.data);

      if (response.data && response.data.message === 'Leads created successfully.') {
        console.log('Leads created successfully.');
      } else if (response.data && response.data.message === 'Some leads were rejected due to duplicates.') {
        console.log('Some leads were rejected due to duplicates.');
      } else {
        console.log('Unexpected response data:', response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportButtonClick = () => {
    setIsExporting(true);
  };

  return (
    <div>
      <Header />
      <div className="chooser-button-container">
        <div className="import-export-container">
          <ImportExport onImport={handleImport} onExport={handleExport} onAppend={handleAppend} />
        </div>
  
        {!isExporting && !showAppend && !fileSelected && (
          <FileSelect onFileSelect={handleFileSelect} />
        )}
  
        {isExporting ? (
          <ExportComponent />
        ) : (
          <>
            {showAppend && <AppendComponent />}
            {fileSelected && !showAppend && (
              <div className="data-preview-container">
                <div className="search-filter-container">
                  <input
                    type="text"
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search leads"
                  />
                  <Dropdown
                    className="filter-dropdown"
                    placeholder="Select filter"
                    selection
                    options={filterOptions}
                    value={filterTerm}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="Filter-button-container">
                  <Button onClick={selectAllLeads}>Select All</Button>
                  <Button primary onClick={deselectAll}>
                    Deselect All
                  </Button>
                  <Button onClick={selectAllFiltered}>Select All Filtered</Button>
                  <Button onClick={deselectAllFiltered}>Deselect All Filtered</Button>
                  <Button onClick={toggleShowSelected}>{showSelected ? 'Show All' : 'Show Selected'}</Button>
                  <Button onClick={submitSelectedLeads}>Submit Selected</Button>
                  
                </div>
                
                <div className="table-container">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Profile Group</th>
                      <th>Service Address</th>
                      <th>Selected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLeads
                      .filter((lead) => lead.record_type === '2')
                      .map((lead) => (
                        <tr key={lead.id}>
                          <td>{lead.customer_name}</td>
                          <td>{profileMappings[lead.profile_group]}</td>
                          <td>
                            {lead.service_address_1}, {lead.service_city}, {lead.service_state},{' '}
                            {getFormattedPostalCode(lead.service_postal_code)}
                          </td>
                          <td>
                            <Checkbox
                              checked={lead.isSelectedForDatabase}
                              onChange={() => toggleCheckbox(lead.id)}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                </div>
                <div className="pagination-container">
                  <PaginationViewer totalPages={totalPages} onPageChange={handlePageChange} />
                </div >
              </div>
              
            )}
          </>
        )}
      </div>
    </div>
  );
  
}

export default App;
