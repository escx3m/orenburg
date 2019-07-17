import React from 'react';
import SearchForm from '../forms/SearchForm';
import ListTrips from './ListTrips';

const trips = [
  {
    cityFrom: 'asd',
    cityTo: 'qwe',
    time: new Date()
  },
  {
    cityFrom: 'qqq',
    cityTo: 'aaa',
    departureTime: new Date(),
    arrivalTime: new Date()
  },
  {
    cityFrom: 'zzz',
    cityTo: 'xxx',
    departureTime: new Date(),
    arrivalTime: new Date()
  }
];

class SearchPage extends React.Component {
  state = {
    trips: []
  }
  submit = (data) => {
    this.setState({ trips });
  }

  render() {
    const { trips } = this.state;
    const showTrips = !!trips.length;
    return (
      <div>
        <SearchForm submit={this.submit} />
        {showTrips && <ListTrips trips={trips} />}
      </div>
    );
  }
}

export default SearchPage;
