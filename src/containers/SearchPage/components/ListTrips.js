import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Segment } from 'semantic-ui-react';

const ListTripItem = ({ trip: { cityFrom, cityTo } }) => (
  <Segment>
    <Grid textAlign='center' columns={3}>
    <Grid.Column>
      <span>{cityFrom}</span>
    </Grid.Column>
    <Grid.Column>
      <span>{cityTo}</span>
    </Grid.Column>
    <Grid.Column>
      <Button primary>Купить</Button>
    </Grid.Column>
  </Grid>
  </Segment>
);

function ListTrips({ trips }) {
  const listTrips = trips.map((trip, i) => <ListTripItem key={i} trip={trip} />)
  return (
    <Segment.Group>
      {listTrips}
      <Segment><Link to="/personInfo">Next</Link></Segment>
    </Segment.Group>
  );
}

export default ListTrips;
