import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import LeadTile from './LeadTile';

class DataPreview extends Component {
  handleSubmit = (event) => {
    event.preventDefault();

    if (this.props.onPreviewDataSubmit) {
      this.props.onPreviewDataSubmit(this.props.data);
    }
  };

  render() {
    const { data } = this.props;

    let filteredData = [];
    // Check if data is an array before attempting to filter it
    if (Array.isArray(data)) {
      // Filter data before passing it to LeadTile
      filteredData = data.filter((item) => {
        return item.customer_name && item.profile_group && item.service_address1;
      });
    }

    return (
      <Card.Group>
        <form onSubmit={this.handleSubmit}>
          {filteredData.map((item, index) => (
            <LeadTile key={index} leadData={item} />
          ))}
          <button type="submit">Submit</button>
        </form>
      </Card.Group>
    );
  }
}

export default DataPreview;
