import { GET_TRIPS, GET_TRIPS_SUCCESS, GET_TRIPS_ERROR } from './constants';
import api from '../../api';

export const getTripsStart = () => ({
  type: GET_TRIPS
});

export const getTripsSuccess = trips => ({
  type: GET_TRIPS_SUCCESS,
  trips
});

export const getTripsError = error => ({
  type: GET_TRIPS_ERROR,
  error
});

export const getTrips = credentials => dispatch => {
  dispatch(getTripsStart());
  api.trips.get(credentials).then(
    trips => {
      return dispatch(getTripsSuccess(trips));
    },
    error => dispatch(getTripsError(error))
  );
}
