import React from "react";
import { connect } from "react-redux";
import moment from "moment-timezone";
import qs from "query-string";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchForm from "./components/SearchForm";
import ListTrips from "./components/ListTrips";
import { getTrips, chooseTrip } from "./actions";
import { cityTimeZones, passengerStates } from "./constants";

const { ym } = window;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

export const getCombinedTrips = (trips, cityFrom) => {
  const correctedTrips = trips.map(trip => {
    // if ([10, 23].includes(trip.fromCityId) && trip.external === 1) {
    //   const fromTime = moment(trip.fromTime).subtract(1, 'hours').toISOString();
    //   return { ...trip, fromTime };
    // }
    return trip;
  });

  const combinedTrips = correctedTrips
    .map(trip => {
      return trip;
    })
    .reduce((acc, trip) => {
      if (!acc.includes(trip.fromTime)) acc.push(trip.fromTime);
      return acc;
    }, [])
    .map(fromTime =>
      correctedTrips
        .filter(tripTofilter => {
          return fromTime === tripTofilter.fromTime;
        })
        .map(({ fromTime, passengers, carScheme, reserved }) => {
          const seats = carScheme ? carScheme.seats : 0;
          const currentTime = moment().toISOString();
          const passengersCount = passengers.filter(item =>
            passengerStates.includes(item.state)
          ).length;
          if (seats === 0) {
          }
          const { timeZone } = cityTimeZones.find(
            item => item.city === cityFrom
          );
          return {
            fromTime: {
              time: fromTime,
              hours: moment.tz(fromTime, timeZone).hour(),
              minutes: moment.tz(fromTime, timeZone).minutes()
            },
            availableRoute: currentTime < fromTime,
            availableSeats: seats - reserved - passengersCount
          };
        })
        .reduce(({ fromTime, availableRoute, availableSeats }, item) => ({
          fromTime,
          availableRoute,
          availableSeats: availableSeats + item.availableSeats
        }))
    )
    .filter(({ availableRoute }) => availableRoute);
  console.log("getCombinedTrips", combinedTrips);
  return combinedTrips;
};
const SearchPage = props => {
  const classes = useStyles();
  const submit = data => {
    console.log("DATA", data);
    ym(34728795, "reachGoal", "search");
    const localTimeZone = cityTimeZones.find(
      ({ city }) => city === data.cityFrom
    ).timeZone;
    const localTime = moment(data.date)
      .clone()
      .tz(localTimeZone);
    props.getTrips({
      ...data,
      dateStart: localTime.startOf("day").format(),
      dateEnd: localTime.endOf("day").format()
    });
  };

  const buyButtonClickHandler = (
    cityFromText,
    cityToText,
    dateText,
    timeText,
    departureTimeText,
    arrivalTimeText
  ) => {
    ym(34728795, "reachGoal", "booking");
    props.chooseTrip(
      cityFromText,
      cityToText,
      dateText,
      timeText,
      departureTimeText,
      arrivalTimeText
    );
    props.history.push("/personInfo");
  };

  const {
    trips,
    cityFrom,
    cityTo,
    seats,
    date,
    loading,
    showTrips,
    location
  } = props;
  const { city_from, city_to } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
  const initialValues = {
    cityFrom: city_from || cityFrom,
    cityTo: city_to || cityTo,
    date: date || new Date(),
    seats
  };

  // console.log("index search trips ", trips)
  return (
    <div className={classes.root}>
      <SearchForm
        onSubmit={submit}
        initialValues={initialValues}
        trips={trips}
      />

      {loading && <CircularProgress disableShrink />}
      {showTrips && (
        <ListTrips
          trips={trips}
          cityFrom={cityFrom}
          cityTo={cityTo}
          date={date}
          seats={seats}
          handleButtonClick={buyButtonClickHandler}
        />
      )}
    </div>
  );
};

const mapStateToProps = ({ trips }) => ({ ...trips });

export default connect(mapStateToProps, { getTrips, chooseTrip })(SearchPage);
