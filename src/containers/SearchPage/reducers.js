import { GET_TRIPS, GET_TRIPS_SUCCESS, GET_TRIPS_ERROR, cityOptions } from './constants';

const initialState = {
  trips: [],
  loading: false,
  cityFrom: null,
  cityTo: null,
  error: null
}

export const trips = (state = initialState, action) => {
  switch(action.type) {
    case GET_TRIPS:
      console.log(action);
      const cityFrom = cityOptions.find(item => item.value === action.cityFrom).text;
      const cityTo = cityOptions.find(item => item.value === action.cityTo).text;
      return {
        ...state,
        cityFrom,
        cityTo,
        trips: [],
        loading: true
      };
    case GET_TRIPS_SUCCESS:
      const { trips } = action;
      console.log('GET_TRIPS_SUCCESS', action);
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
