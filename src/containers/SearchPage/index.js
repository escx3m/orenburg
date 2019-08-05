import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import SearchForm from './components/SearchForm';
import ListTrips from './components/ListTrips';
import { getTrips } from './actions';
import { cityTimeZones, passengerStates } from './constants';

const getCombinedTrips = (trips, cityFrom) => {
  const combinedTrips = trips
    .reduce((acc, item) => {
      if (!acc.includes(item.fromTime)) acc.push(item.fromTime)
      return acc;
    }, [])
    .map((fromTime) => trips
      .filter((tripTofilter) => {
        return fromTime === tripTofilter.fromTime;
      })
      .map(({ fromTime, passengers, carScheme: { seats } }) => {
        const passengersCount = passengers.filter((item) => passengerStates.includes(item.state)).length;
        const { timeZone } = cityTimeZones.find((item) => item.city === cityFrom);
        return {
          fromTime: {
            hours: moment.tz(fromTime, timeZone).hour(),
            minutes: moment.tz(fromTime, timeZone).minutes()
          },
          availableSeats: seats - passengersCount,
        };
      })
      .reduce(({ fromTime, availableSeats }, item) => ({
        fromTime,
        availableSeats: availableSeats + item.availableSeats
      }))
    );
  return combinedTrips;
}
class SearchPage extends React.Component {
  submit = (data) => {
    const localTime = moment.tz(data.date, 'Europe/Volgograd');
    console.log(data.date, localTime.startOf('day').format());
    this.props.getTrips({ ...data, dateStart: localTime.startOf('day').format(), dateEnd: localTime.endOf('day').format() });
  }

  render() {
    const { trips, cityFrom, cityTo, loading } = this.props;
    const combinedTrips = getCombinedTrips(trips, cityFrom);
    const showTrips = !!trips.length;
    return (
      <div>
        <SearchForm onSubmit={this.submit} initialValues={{ date: new Date() }} trips={trips} />
        {loading && 'Loading...'}
        {showTrips && <ListTrips trips={combinedTrips} cityFrom={cityFrom} cityTo={cityTo} />}
      </div>
    );
  }
}

const mapStateToProps = (({ trips }) => ({ ...trips }));

export default connect(mapStateToProps, { getTrips })(SearchPage);
