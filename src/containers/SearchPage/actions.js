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
  if ([cityFrom, cityTo].every(city => ['119', '23'].includes(city))) {
    const Elista = '166';
    const departureTime = {
      '119': { toElistaTime: 20, fromElistaTime: 3 },
      '23': { toElistaTime: 21, fromElistaTime: 1 }
    }[cityFrom];
    const routesToElista = await api.trips.get({ ...data, cityTo: Elista});
    const dateStart = moment(data.dateStart).add(1, 'days').format();
    const dateEnd = moment(data.dateEnd).add(1, 'days').format();
    const routesFromElista = await api.trips.get({ ...data, cityFrom: Elista, dateStart, dateEnd });

    const toElista = getCombinedTrips(routesToElista, cityFrom).find(({ fromTime }) => fromTime.hours === departureTime.toElistaTime);
    const fromElista = getCombinedTrips(routesFromElista, Elista).find(({ fromTime }) => fromTime.hours === departureTime.fromElistaTime);

    if (toElista && fromElista) {
      const availableSeats = Math.min(toElista.availableSeats, fromElista.availableSeats)
      return dispatch(getTripsSuccess([{ ...toElista, availableSeats }]));
    }
    return dispatch(getTripsSuccess([]));
  } else {
    const trips = await api.trips.get(data);
    return dispatch(getTripsSuccess(getCombinedTrips(trips, cityFrom)));
  }
}
