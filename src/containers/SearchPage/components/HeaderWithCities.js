import React from 'react';
import { Segment, Header } from 'semantic-ui-react';

const HeaderWithCities = ({ cityFrom, cityTo }) => (
  <Segment>
    <Header as='h3' style={{ fontSize: '2em' }}>
      {cityFrom} - {cityTo}
    </Header>
  </Segment>
);

export default HeaderWithCities;
