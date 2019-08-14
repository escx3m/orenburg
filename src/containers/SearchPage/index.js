import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import SearchForm from './components/SearchForm';
import ListTrips from './components/ListTrips';
import { getTrips } from './actions';
import { cityTimeZones, passengerStates } from './constants';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

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
const SearchPage = (props) => {
  const classes = useStyles();
  const submit = (data) => {
    const localTimeZone = cityTimeZones.find(({ city }) => city === data.cityFrom).timeZone;
    const localTime = moment.tz(data.date, localTimeZone);
    props.getTrips({ ...data, dateStart: localTime.startOf('day').format(), dateEnd: localTime.endOf('day').format() });
  }

  const buyButtonClickHandler = () => {
    props.history.push('/personInfo');
  }
  
  const { trips, cityFrom, cityTo, date, loading } = props;
  const combinedTrips = getCombinedTrips(trips, cityFrom);
  const showTrips = !!trips.length;
  return (
    <div className={classes.root}>
      <SearchForm onSubmit={submit} initialValues={{ date: new Date() }} trips={trips} />
      {loading && <CircularProgress disableShrink />}
      {showTrips && <ListTrips trips={combinedTrips} cityFrom={cityFrom} cityTo={cityTo} date={date} handleButtonClick={buyButtonClickHandler} />}
    </div>
  );
}

const mapStateToProps = (({ trips }) => ({ ...trips }));

export default connect(mapStateToProps, { getTrips })(SearchPage);
