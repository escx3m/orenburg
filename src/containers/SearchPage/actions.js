import { GET_TRIPS, GET_TRIPS_SUCCESS, GET_TRIPS_ERROR } from './constants';
import api from '../../api';

export const getTripsStart = ({ cityFrom, cityTo }) => ({
  type: GET_TRIPS,
  cityFrom,
  cityTo
});

export const getTripsSuccess = trips => ({
  type: GET_TRIPS_SUCCESS,
  trips
});

export const getTripsError = error => ({
  type: GET_TRIPS_ERROR,
  error
});

export const getTrips = data => dispatch => {
  dispatch(getTripsStart(data));
  api.trips.get(data).then(
    trips => {
      return dispatch(getTripsSuccess(trips));
    },
    error => dispatch(getTripsError(error))
  );
}
