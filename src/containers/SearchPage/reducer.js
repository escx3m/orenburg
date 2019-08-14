import { GET_TRIPS, GET_TRIPS_SUCCESS, GET_TRIPS_ERROR } from './constants';

const initialState = {
  trips: [],
  loading: false,
  cityFrom: null,
  cityTo: null,
  date: null,
  error: null
}

export const trips = (state = initialState, action) => {
  switch(action.type) {
    case GET_TRIPS:
      const { cityFrom, cityTo, date } = action;
      return {
        ...state,
        cityFrom,
        cityTo,
        date,
        trips: [],
        loading: true
      };
    case GET_TRIPS_SUCCESS:
      const { trips } = action;
      return {
        ...state,
        trips,
        loading: false
      };
    case GET_TRIPS_ERROR:
      const { error } = action;
      return {
        ...state,
        error,
        loading: false
      };
    default: return state;
  }
};
