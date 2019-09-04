import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import SearchForm from './components/SearchForm';
import ListTrips from './components/ListTrips';
import { getTrips, chooseTrip } from './actions';
import { cityTimeZones, passengerStates } from './constants';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const getCombinedTrips = (trips, cityFrom) => {
  const combinedTrips = trips
    .reduce((acc, item) => {
      if (!acc.includes(item.fromTime)) acc.push(item.fromTime)
      return acc;
    }, [])
    .map((fromTime) => trips
      .filter((tripTofilter) => {
        return fromTime === tripTofilter.fromTime;
      })
      .map(({ fromTime, passengers, carScheme: { seats }, reserved }) => {
        const currentTime = moment().toISOString();
        const passengersCount = passengers.filter((item) => passengerStates.includes(item.state)).length;
        const { timeZone } = cityTimeZones.find((item) => item.city === cityFrom);
        return {
          fromTime: {
            hours: moment.tz(fromTime, timeZone).hour(),
            minutes: moment.tz(fromTime, timeZone).minutes()
          },
          availableRoute: currentTime < fromTime,
          availableSeats: seats - reserved - passengersCount,
        };
      })
      .reduce(({ fromTime, availableRoute, availableSeats }, item) => ({
        fromTime,
        availableRoute,
        availableSeats: availableSeats + item.availableSeats
      }))
    ).filter(({ availableRoute }) => availableRoute);
  return combinedTrips;
}
const SearchPage = (props) => {
  const classes = useStyles();
  const submit = (data) => {
    const localTimeZone = cityTimeZones.find(({ city }) => city === data.cityFrom).timeZone;
    const localTime = moment(data.date).clone().tz(localTimeZone);
    props.getTrips({ ...data, dateStart: localTime.startOf('day').format(), dateEnd: localTime.endOf('day').format() });
  }
  
  const buyButtonClickHandler = (cityFromText, cityToText, dateText, timeText) => {
    props.chooseTrip(cityFromText, cityToText, dateText, timeText);
    props.history.push('/personInfo');
  }
  
  const { trips, cityFrom, cityTo, seats, date, loading, showTrips } = props;
  return (
    <div className={classes.root}>
      <SearchForm onSubmit={submit} initialValues={{ date: new Date() }} trips={trips} />
      {loading && <CircularProgress disableShrink />}
      {showTrips && <ListTrips trips={trips} cityFrom={cityFrom} cityTo={cityTo} date={date} seats={seats} handleButtonClick={buyButtonClickHandler} />
}
    </div>
  );
}

const mapStateToProps = (({ trips }) => ({ ...trips }));

export default connect(mapStateToProps, { getTrips, chooseTrip })(SearchPage);
