import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import SearchForm from './components/SearchForm';
import HeaderWithCities from './components/HeaderWithCities';
import ListTrips from './components/ListTrips';
import { getTrips } from './actions';
class SearchPage extends React.Component {
  submit = (data) => {
    this.props.getTrips(data);
  }

  render() {
    const { trips, cityFrom, cityTo, loading } = this.props;
    const combinedTrips = trips.map((trip) => trips
      .filter((tripTofilter) => trip.fromTimeLocal === tripTofilter.fromTimeLocal)
      .map(({ fromTimeLocal, passengers, carScheme: { seats } }) => {
        const passengersCount = passengers.filter((item) => item.state === 2).length;
        console.log(fromTimeLocal, seats, passengersCount);
        return {
          fromTimeLocal: new Date(fromTimeLocal),
          availableSeats: seats - passengersCount,
        };
      })
      .reduce(({ fromTimeLocal, availableSeats }, item) => ({
        fromTimeLocal,
        availableSeats: availableSeats + item.availableSeats
      }))
    );
    console.log(combinedTrips);
    // trips.sort((a, b) => a.fromTimeLocal < b.fromTimeLocal ).forEach(trip => {
    //   const date = new Date(trip.fromTimeLocal);
    //   console.log(date.getDate(), date.getHours(), date.getMinutes());
    //   console.log(date);
    // })
    const showTrips = !!trips.length;
    return (
      <div>
        <SearchForm onSubmit={this.submit} initialValues={{ date: new Date() }} trips={trips} />
        {cityFrom && cityTo && <HeaderWithCities  cityFrom={cityFrom} cityTo={cityTo} />}
        {loading && 'Loading...'}
        {showTrips && <ListTrips trips={combinedTrips} />}
      </div>
    );
  }
}

const mapStateToProps = (state => {
  const selector = formValueSelector('searchFrom');

  const { trips } = state;

  const cityFrom = selector(state, 'cityFrom');
  const cityTo = selector(state, 'cityTo');
  return {
    ...trips
  };
});

export default connect(mapStateToProps, { getTrips })(SearchPage);
