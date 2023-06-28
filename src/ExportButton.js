import { Button } from 'semantic-ui-react';
import { CsvWriter } from 'csv-writer';

const ExportButton = ({ selectedLeads }) => {
  const handleExport = () => {
    if (selectedLeads.length === 0) {
      console.log('No leads selected.');
      return;
    }

    const csvWriter = new CsvWriter({
      path: 'leads.csv',
      header: [
        { id: 'customer_name', title: 'Customer Name' },
        { id: 'profile_group', title: 'Profile Group' },
        { id: 'service_address_1', title: 'Service Address 1' },
        { id: 'service_city', title: 'Service City' },
        { id: 'service_state', title: 'Service State' },
        { id: 'service_postal_code', title: 'Service Postal Code' },
        { id: 'billing_address_1', title: 'Billing Address 1' },
        { id: 'billing_city', title: 'Billing City' },
        { id: 'billing_state', title: 'Billing State' },
        { id: 'billing_postal_code', title: 'Billing Postal Code' },
        // Add more fields as needed
      ],
    });

    csvWriter.writeRecords(selectedLeads)
      .then(() => console.log('Leads exported successfully.'))
      .catch((error) => console.error('Failed to export leads:', error));
  };

  return (
    <Button onClick={handleExport}>
      Export Selected Leads
    </Button>
  );
};
