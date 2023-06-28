import React from 'react';
import { Card } from 'semantic-ui-react';

const LeadTile = ({ leadData, style }) => {
  return (
    <Card style={style}>
      <Card.Content>
        <Card.Header>{leadData.customer_name}</Card.Header>
        <Card.Meta>{leadData.profile_group}</Card.Meta>
        <Card.Description>
          {`${leadData.service_address1}`}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default LeadTile;
