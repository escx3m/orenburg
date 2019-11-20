export const GET_TRIPS = 'GET_TRIPS';
export const GET_TRIPS_SUCCESS = 'GET_TRIPS_SUCCESS';
export const GET_TRIPS_ERROR = 'GET_TRIPS_ERROR';
export const CHOOSE_TRIP = 'CHOOSE_TRIP';
export const RESET = 'trips/RESET';

export const cityOptions = [
  { key: 'orenburg', value: '106', text: 'Оренбург' },
  { key: 'buzuluk', value: '2404', text: 'Бузулук' },
  { key: 'samara', value: '123', text: 'Самара' },
  // { key: 'kurumoch', value: '23', text: 'Курумоч' },
  { key: 'tolyatti', value: '143', text: 'Тольятти' },
  { key: 'yekaterinburg', value: '49', text: 'Екатеринбург' },
];

export const cityTimeZones = [
  { city: '106', timeZone: 'Europe/Orenburg' },
  { city: '2404', timeZone: 'Europe/Orenburg' },
  { city: '123', timeZone: 'Europe/Samara' },
  // { city: '23', timeZone: 'Europe/Astrakhan' },
  { city: '143', timeZone: 'Europe/Tolyatti' },
  { city: '49', timeZone: 'Europe/Yekaterinburg' },
]

export const timeWindowPhoneRedir = {
  maxMinutes: 1440,
}

export const waysTime = [
  {
    fromCityId: '106', 
    toCityId: '2404', 
    wayTime: {
      hours: 3, 
      minutes: 0,
    } 
  },
  {
    fromCityId: '2404', 
    toCityId: '106', 
    wayTime: {
      hours: 3, 
      minutes: 0,
    }
  },
  {
    fromCityId: '106', 
    toCityId: '123', 
    wayTime: {
      hours: 6, 
      minutes: 0,
    }
  },
  {
    fromCityId: '123', 
    toCityId: '106', 
    wayTime: {
      hours: 6, 
      minutes: 0,
    }
  },
  // {
  //   fromCityId: '106', 
  //   toCityId: '23', 
  //   wayTime: {
  //     hours: 7, 
  //     minutes: 0,
  //   }
  // },
  // {
  //   fromCityId: '23', 
  //   toCityId: '106', 
  //   wayTime: {
  //     hours: 7, 
  //     minutes: 0,
  //   }
  // },
  {
    fromCityId: '106', 
    toCityId: '143', 
    wayTime: {
      hours: 8, 
      minutes: 0,
    }
  },
  {
    fromCityId: '143', 
    toCityId: '106', 
    wayTime: {
      hours: 8, 
      minutes: 0,
    }
  },
  {
    fromCityId: '106', 
    toCityId: '49', 
    wayTime: {
      hours: 13, 
      minutes: 0,
    }
  },
  {
    fromCityId: '49', 
    toCityId: '106', 
    wayTime: {
      hours: 13, 
      minutes: 0,
    }
  },
];

export const arriveInterval = {
  hours: 1,
  minutes: 0,
}

export const passengerStates = [1, 2, 3];
