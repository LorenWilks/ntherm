import React, { useState, useEffect, useCallback } from 'react';
import { Input, Checkbox, Dropdown, Button, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';
import PaginationViewer from './PaginationViewer';

const filterOptions = [
  { key: 'option0', value: '', text: 'No filter' },
  { key: 'option1', value: 'CCOHRESA', text: 'Residential Class' },
  { key: 'option2', value: 'CCOHNONA', text: 'Non-Demand Meter Class' },
  { key: 'option3', value: 'CCOHDM2U', text: 'Demand Metered Secondary Class' },
  { key: 'option4', value: 'CCOHDM2O', text: 'Demand Metered Secondary Class 2' },
  { key: 'option5', value: 'CCOHDMPU', text: 'Demand Metered Primary Class' },
  { key: 'option6', value: 'CCOHDMPO', text: 'Demand Metered Primary Class 2' },
  { key: 'option7', value: 'CCOHDMTU', text: 'Demand Metered Subtransmission/Transmission Class' },
  { key: 'option8', value: 'CCOHDMTO', text: 'Demand Metered Subtransmission/Transmission Class 2' },
  { key: 'option9', value: 'CCOHLITE', text: 'Residential Outdoor Light & Street Light' },
  { key: 'option10', value: 'CCOHFLAT', text: 'FLAT' }
];

const ExportComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addressSearchTerm, setAddressSearchTerm] = useState('');
  const [phoneNumberSearchTerm, setPhoneNumberSearchTerm] = useState('');
  const [savedLeads, setSavedLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filterOption, setFilterOption] = useState('');
  const [isSelectedForExport, setIsSelectedForExport] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 100;
  const [showSelected, setShowSelected] = useState(false);

  const filterLeads = useCallback(() => {
    let filteredLeads = savedLeads;

    if (searchTerm) {
      filteredLeads = filteredLeads.filter((lead) =>
        lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (addressSearchTerm) {
      filteredLeads = filteredLeads.filter((lead) =>
        [
          lead.service_address_1,
          lead.service_city,
          lead.service_state,
          lead.service_postal_code,
          lead.billing_address_1,
          lead.billing_city,
          lead.billing_state,
          lead.billing_postal_code
        ].some((value) => value.toLowerCase().includes(addressSearchTerm.toLowerCase()))
      );
    }

    if (phoneNumberSearchTerm) {
      filteredLeads = filteredLeads.filter((lead) =>
        lead.phone_number.includes(phoneNumberSearchTerm)
      );
    }

    if (filterOption) {
      filteredLeads = filteredLeads.filter((lead) => lead.profile_group === filterOption);
    }

    setFilteredLeads(filteredLeads);
    setCurrentPage(1); // Reset to the first page when filtering is applied
  }, [searchTerm, addressSearchTerm, phoneNumberSearchTerm, filterOption, savedLeads]);

  useEffect(() => {
    filterLeads();
  }, [filterLeads]);

  const handleSearchSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/leads');
      setSavedLeads(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLeadSelection = (leadId) => {
    setIsSelectedForExport((prevState) => ({
      ...prevState,
      [leadId]: !prevState[leadId],
    }));
  };

  const handleExport = (format) => {
    const selectedLeads = filteredLeads.filter((lead) => isSelectedForExport[lead.id]);

    if (selectedLeads.length === 0) {
      console.log('No leads selected.');
      return;
    }

    if (format === 'csv') {
      const csvContent = createCsv(selectedLeads);
      downloadFile(csvContent, 'leads.csv', 'text/csv');
      console.log('Leads exported successfully as CSV.');
    } else if (format === 'json') {
      const jsonContent = createJSON(selectedLeads);
      downloadFile(jsonContent, 'leads.json', 'application/json');
      console.log('Leads exported successfully as JSON.');
    } else if (format === 'txt') {
      const txtContent = createTxt(selectedLeads);
      downloadFile(txtContent, 'leads.txt', 'text/plain');
      console.log('Leads exported successfully as TXT.');
    }
  };

  const downloadFile = (content, fileName, contentType) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    element.click();
  };

  const createCsv = (leads) => {
    const csvRows = leads.map((lead) =>
      `${lead.customer_name},${lead.profile_group},${lead.service_address_1},${lead.service_city},${lead.service_state},${lead.service_postal_code},${lead.billing_address_1},${lead.billing_city},${lead.billing_state},${lead.billing_postal_code}`
    );
    return csvRows.join('\n');
  };

  const createJSON = (leads) => {
    return JSON.stringify(leads, null, 2);
  };

  const createTxt = (leads) => {
    const txtContent = leads
      .map((lead) =>
        `${lead.customer_name}, ${lead.profile_group}, ${lead.service_address_1}, ${lead.service_city}, ${lead.service_state}, ${lead.service_postal_code},${lead.billing_address_1},${lead.billing_city},${lead.billing_state},${lead.billing_postal_code}`
      )
      .join('\n');
    return txtContent;
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddressSearchChange = (event) => {
    setAddressSearchTerm(event.target.value);
  };

  const handlePhoneNumberSearchChange = (event) => {
    setPhoneNumberSearchTerm(event.target.value);
  };

  const handleFilterOptionChange = (event, data) => {
    setFilterOption(data.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = showSelected
    ? filteredLeads.filter((lead) => isSelectedForExport[lead.id])
    : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const handleSelectPage = () => {
    const pageLeads = showSelected
      ? filteredLeads.filter((lead) => isSelectedForExport[lead.id])
      : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const pageSelected = pageLeads.every((lead) => isSelectedForExport[lead.id]);

    if (pageSelected) {
      pageLeads.forEach((lead) => {
        setIsSelectedForExport((prevState) => ({
          ...prevState,
          [lead.id]: false,
        }));
      });
    } else {
      pageLeads.forEach((lead) => {
        setIsSelectedForExport((prevState) => ({
          ...prevState,
          [lead.id]: true,
        }));
      });
    }
  };

  const selectAllFiltered = () => {
    const filteredLeadsToSelect = filteredLeads.filter((lead) => !isSelectedForExport[lead.id]);
    const updatedSelected = { ...isSelectedForExport };

    filteredLeadsToSelect.forEach((lead) => {
      updatedSelected[lead.id] = true;
    });

    setIsSelectedForExport(updatedSelected);
  };

  const deselectAllFiltered = () => {
    const filteredLeadsToDeselect = filteredLeads.filter((lead) => isSelectedForExport[lead.id]);
    const updatedSelected = { ...isSelectedForExport };

    filteredLeadsToDeselect.forEach((lead) => {
      updatedSelected[lead.id] = false;
    });

    setIsSelectedForExport(updatedSelected);
  };

  const toggleShowSelected = () => {
    setShowSelected((prevShowSelected) => !prevShowSelected);
  };

  const renderLeads = currentLeads.map((lead) => (
    <tr key={lead.id}>
      <td>{lead.customer_name}</td>
      <td>{lead.profile_group}</td>
      <td>{lead.service_address_1}</td>
      <td>
        <Checkbox
          checked={isSelectedForExport[lead.id] || false}
          onChange={() => toggleLeadSelection(lead.id)}
        />
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Search Database</h1>

      <div>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Name"
        />
      </div>

      <div>
        <Input
          type="text"
          value={addressSearchTerm}
          onChange={handleAddressSearchChange}
          placeholder="Search by Address"
        />
      </div>

      <div>
        <Input
          type="text"
          value={phoneNumberSearchTerm}
          onChange={handlePhoneNumberSearchChange}
          placeholder="Search by Phone Number"
        />
      </div>

      <div>
        <Dropdown
          placeholder="Select filter"
          selection
          options={filterOptions}
          value={filterOption}
          onChange={handleFilterOptionChange}
        />
      </div>

      <div>
        <Button onClick={handleSearchSubmit}>Search</Button>
      </div>

      <div>
        <Button onClick={handleSelectPage}>Select/Deselect Page</Button>
        <Button onClick={selectAllFiltered}>Select All Filtered</Button>
        <Button onClick={deselectAllFiltered}>Deselect All Filtered</Button>
        <Button onClick={toggleShowSelected}>{showSelected ? 'Show All' : 'Show Selected'}</Button>
      </div>

      <div>
        {isLoading ? (
          <Dimmer active>
            <Loader>Loading...</Loader>
          </Dimmer>
        ) : (
          <table className="leads-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Profile Group</th>
                <th>Service Address</th>
                <th>Selected</th>
              </tr>
            </thead>
            <tbody>{renderLeads}</tbody>
          </table>
        )}
      </div>

      <div>
        <PaginationViewer totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <div>
        <Button onClick={() => handleExport('csv')}>Export as CSV</Button>
        <Button onClick={() => handleExport('json')}>Export as JSON</Button>
        <Button onClick={() => handleExport('txt')}>Export as TXT</Button>
      </div>
    </div>
  );
};

export default ExportComponent;
