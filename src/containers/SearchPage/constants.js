export const GET_TRIPS = 'GET_TRIPS';
export const GET_TRIPS_SUCCESS = 'GET_TRIPS_SUCCESS';
export const GET_TRIPS_ERROR = 'GET_TRIPS_ERROR';
export const CHOOSE_TRIP = 'CHOOSE_TRIP';
export const RESET = 'trips/RESET';

export const cityOptions = [
  { key: 'elista', value: '166', text: 'Элиста' },
  { key: 'rostov', value: '119', text: 'Ростов-на-Дону' },
  { key: 'volgograd', value: '10', text: 'Волгоград' },
  { key: 'astrakhan', value: '23', text: 'Астрахань' },
];

export const cityTimeZones = [
  { city: '166', timeZone: 'Europe/Moscow' },
  { city: '119', timeZone: 'Europe/Moscow' },
  { city: '10', timeZone: 'Europe/Volgograd' },
  { city: '23', timeZone: 'Europe/Astrakhan' },
]

export const timeWindowPhoneRedir = {
  maxMinutes: 120,
}

export const passengerStates = [2, 3];
