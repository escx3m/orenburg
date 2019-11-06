import { GET_TRIPS, GET_TRIPS_SUCCESS, GET_TRIPS_ERROR, CHOOSE_TRIP, RESET } from './constants';

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
      const { cityFrom, cityTo, seats, date, dateStart, dateEnd } = action;
      return {
        ...state,
        cityFrom,
        cityTo,
        seats,
        date,
        dateStart,
        dateEnd,
        trips: [],
        loading: true,
        showTrips: false,
      };
    case GET_TRIPS_SUCCESS:
      const { trips } = action;
      return {
        ...state,
        trips,
        loading: false,
        showTrips: true,
      };
    case GET_TRIPS_ERROR:
      const { error } = action;
      return {
        ...state,
        error,
        loading: false,
        showTrips: true,
      };
    case CHOOSE_TRIP:
      const { cityFromText, cityToText, dateText, timeText, departureTimeText, arrivalTimeText } = action;
      return {
        ...state,
        cityFromText,
        cityToText,
        dateText,
        timeText,
        departureTimeText,
        arrivalTimeText,
      };
    case RESET: {
      return initialState;
    }
    default: return state;
  }
};
