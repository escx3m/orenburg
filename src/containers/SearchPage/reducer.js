import { GET_TRIPS, GET_TRIPS_SUCCESS, GET_TRIPS_ERROR, CHOOSE_TRIP } from './constants';

const initialState = {
  trips: [],
  loading: false,
  cityFrom: null,
  cityTo: null,
  seats: 1,
  cityFromText: '',
  cityToText: '',
  dateText: '',
  timeText: '',
  date: null,
  error: null
}

export const trips = (state = initialState, action) => {
  switch(action.type) {
    case GET_TRIPS:
      const { cityFrom, cityTo, seats, date } = action;
      return {
        ...state,
        cityFrom,
        cityTo,
        seats,
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
    case CHOOSE_TRIP:
      const { cityFromText, cityToText, dateText, timeText } = action;
      return {
        ...state,
        cityFromText,
        cityToText,
        dateText,
        timeText
      };
    case 'reset': {
      return initialState;
    }
    default: return state;
  }
};
