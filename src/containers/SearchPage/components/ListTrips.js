import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Segment } from 'semantic-ui-react';

const ListTripItem = ({ trip: { fromTimeLocal, availableSeats } }) => (
  <Segment>
    <Grid textAlign='center' verticalAlign="middle" columns={3}>
    <Grid.Column>
      {`0${fromTimeLocal.getHours()}`.slice(-2)} : {`0${fromTimeLocal.getMinutes()}`.slice(-2)}
    </Grid.Column>
    <Grid.Column>
      <span>{availableSeats}</span>
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
