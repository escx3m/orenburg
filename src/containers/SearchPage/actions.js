import moment from 'moment-timezone';
import { GET_TRIPS, GET_TRIPS_SUCCESS, GET_TRIPS_ERROR, CHOOSE_TRIP, RESET } from './constants';
import api from '../../api';
import { getCombinedTrips } from './index';

export const getTripsStart = ({ cityFrom, cityTo, seats, date, dateStart, dateEnd }) => ({
  type: GET_TRIPS,
  cityFrom,
  cityTo,
  seats,
  date,
  dateStart,
  dateEnd
});

export const getTripsSuccess = trips => ({
  type: GET_TRIPS_SUCCESS,
  trips,
});

export const getTripsError = error => ({
  type: GET_TRIPS_ERROR,
  error,
});

export const chooseTrip = (cityFromText, cityToText, dateText, timeText, departureTimeText, arrivalTimeText) => ({
  type: CHOOSE_TRIP,
  cityFromText,
  cityToText,
  dateText,
  timeText,
  departureTimeText,
  arrivalTimeText
});

export const tripsReset = () => ({
  type: RESET
});

export const getTrips = data => async dispatch => {
  const { cityFrom, cityTo } = data;
  dispatch(getTripsStart(data));
  const Kurumoch = '10203';
  const Samara = '123';

  let copyData = { ...data };
  if (cityFrom === Kurumoch) {
    copyData.cityFrom = Samara;
  } else if (cityTo === Kurumoch) {
    copyData.cityTo = Samara;
  }
  const trips = await api.trips.get(copyData);
  return dispatch(getTripsSuccess(getCombinedTrips(trips, cityFrom)));
}
