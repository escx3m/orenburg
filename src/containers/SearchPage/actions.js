import {
  GET_TRIPS,
  GET_TRIPS_SUCCESS,
  GET_TRIPS_ERROR,
  CHOOSE_TRIP,
  RESET
} from "./constants";
import api from "../../api";
import { getCombinedTrips } from "./index";

export const getTripsStart = ({
  cityFrom,
  cityTo,
  seats,
  date,
  dateStart,
  dateEnd
}) => ({
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
  trips
});

export const getTripsError = error => ({
  type: GET_TRIPS_ERROR,
  error
});

export const chooseTrip = (
  cityFromText,
  cityToText,
  dateText,
  timeText,
  departureTimeText,
  arrivalTimeText
) => ({
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
  console.log("getTrips", getTrips);
  const { cityFrom, cityTo } = data;
  dispatch(getTripsStart(data));
  const Kurumoch = "10203";
  const Samara = "123";
  const Byzylyk = "2404";
  const Orenburg = "106";

  let copyData = { ...data };
  if (cityFrom === Kurumoch || cityFrom === Byzylyk) {
    copyData.cityFrom = Samara;
  } else if (cityTo === Kurumoch || cityTo === Byzylyk) {
    copyData.cityTo = Samara;
  }
  if (cityFrom === Byzylyk && cityTo === Samara) {
    copyData.cityFrom = Orenburg;
    copyData.cityTo = Samara;
  }
  if (cityFrom === Byzylyk && cityTo === Orenburg) {
    copyData.cityFrom = Samara;
    copyData.cityTo = Orenburg;
  }
  if (cityFrom === Samara && cityTo === Byzylyk) {
    copyData.cityFrom = Samara;
    copyData.cityTo = Orenburg;
  }

  const trips = await api.trips.get(copyData);
  return dispatch(getTripsSuccess(getCombinedTrips(trips, cityFrom)));
};
