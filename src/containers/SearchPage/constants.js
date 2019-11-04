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

export const waysTime = [
  {
    fromCityId: '166', 
    toCityId: '119', 
    wayTime: {
      hours: 5, 
      minutes: 30,
    } 
  },
  {
    fromCityId: '119', 
    toCityId: '166', 
    wayTime: {
      hours: 5, 
      minutes: 30,
    }
  },
  {
    fromCityId: '166', 
    toCityId: '10', 
    wayTime: {
      hours: 4, 
      minutes: 0,
    }
  },
  {
    fromCityId: '10', 
    toCityId: '166', 
    wayTime: {
      hours: 4, 
      minutes: 0,
    }
  },
  {
    fromCityId: '166', 
    toCityId: '23', 
    wayTime: {
      hours: 4, 
      minutes: 0,
    }
  },
  {
    fromCityId: '23', 
    toCityId: '166', 
    wayTime: {
      hours: 3, 
      minutes: 30,
    }
  },
  {
    fromCityId: '119', 
    toCityId: '23', 
    wayTime: {
      hours: 11, 
      minutes: 30,
    }
  },
  {
    fromCityId: '23', 
    toCityId: '119', 
    wayTime: {
      hours: 10, 
      minutes: 30,
    }
  },
  {
    fromCityId: '119', 
    toCityId: '10', 
    wayTime: {
      hours: 12, 
      minutes: 30,
    }
  },
  {
    fromCityId: '10', 
    toCityId: '119', 
    wayTime: {
      hours: 10, 
      minutes: 0,
    }
  },
  {
    fromCityId: '10', 
    toCityId: '23', 
    wayTime: {
      hours: 5, 
      minutes: 30,
    }
  },
  {
    fromCityId: '23', 
    toCityId: '10', 
    wayTime: {
      hours: 5, 
      minutes: 30,
    }
  },
];

export const arriveInterval = {
  hours: 1,
  minutes: 0,
}

export const passengerStates = [1, 2, 3];
