export const ADD_PASSENGER = 'ADD_PASSENGER';
export const REMOVE_PASSENGER = 'REMOVE_PASSENGER';
export const UPDATE_PASSENGER = 'UPDATE_PASSENGER';
export const SEND_ORDER = 'SEND_ORDER';
export const SEND_ORDER_SUCCESS = 'SEND_ORDER_SUCCESS';
export const SEND_ORDER_ERROR = 'SEND_ORDER_ERROR';

export const RESET = 'passangers/RESET';

export const discountChild = {
  '0-3': 0.5,
  '4-7': 0.9,
};

export const discountSale = 100;

export const ticketPrices = {
  '106-123': 1000,
  '123-106': 1000,
  '106-143': 1300,
  '143-106': 1300,
  '106-49': 2000,
  '49-106': 2000,
}

export const cityZones = {
  'Оренбург': [[51.6834, 55.0018], [51.8984, 55.203]],
  'Самара': [[53.0905, 50.0062], [53.4313, 50.39]],
  'Тольятти': [[53.4464, 49.1959], [53.5974, 49.6743]],
  'Екатеринбург': [[47.1533, 39.4045], [47.3687, 39.8515]],
  // нужно заменить ЕКБ [[lat_min, lng_min], [lat_max, lng_max]]
};

export const fastAccessLocation = {
  'Оренбург': [
    { value: "ТРЦ Север", fullAddress: "Россия, Оренбургская область, Оренбург, просп. Дзержинского, 23 (2 вход со стороны Театральной)" },
    { value: "ТРЦ Восход", fullAddress: "Россия,Оренбургская область, Оренбург, просп. Победы, 1 (напротив KFC)" },
    { value: "ТРЦ Три мартышки", fullAddress: "Россия, Оренбургская область, Оренбург, просп. Гагарина, 48/3 (на парковке)" },
  ],
  'Самара': [
    { value: "ТРЦ Север", fullAddress: "Россия, Самарская область, Самара, ул. Комсомольская, 81 (центр города)" },
    { value: "Центральный автовокзал", fullAddress: "Россия, Самарская область, Самара, ул. Авроры, 207 а, (KFC)" },
    { value: "ТРЦ Аврора Молл", fullAddress: "Россия, Самарская область, Самара,ул. Аврорвы, 68 а (маг. Мир рыбалки)" },
  ],
  'Тольятти': [
    { value: "Парк Хаус", fullAddress: "Россия, Самарская область, Тольятти, ул.  Автозаводская ,6 (Центральный вход)" },
  ],
  'Екатеринбург': [
    { value: "ж/д Вокзал", fullAddress: "Россия, Свердловская область, Екатеринбург, Пятерочка на парковке" },
  ],
};
