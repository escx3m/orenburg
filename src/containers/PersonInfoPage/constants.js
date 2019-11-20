export const ADD_PASSENGER = 'ADD_PASSENGER';
export const REMOVE_PASSENGER = 'REMOVE_PASSENGER';
export const UPDATE_PASSENGER = 'UPDATE_PASSENGER';
export const SEND_ORDER = 'SEND_ORDER';
export const SEND_ORDER_SUCCESS = 'SEND_ORDER_SUCCESS';
export const SEND_ORDER_ERROR = 'SEND_ORDER_ERROR';

export const RESET = 'passangers/RESET';

export const discountChild = 100;

export const discountSale = 100;

export const ticketPrices = {
  '106-2404': 600 - discountSale,
  '2404-106': 600 - discountSale,
  '106-123': 1000 - discountSale,
  '123-106': 1000 - discountSale,
  // '106-??? Курумоч': 1500 - discountSale,
  // 'Курумоч ???-106': 1500 - discountSale,
  '106-143': 1300 - discountSale,
  '143-106': 1300 - discountSale,
  '106-49': 2000 - discountSale,
  '49-106': 2000 - discountSale,
  // '23air-166': 900 - discountSale,
  // '166-23air': 900 - discountSale,
  // '23-10': 1000 - discountSale,
  // '10-23': 1000 - discountSale,
  // '23air-10': 1200 - discountSale,
  // '10-23air': 1200 - discountSale,
  // '119-23': 1800 - discountSale,
  // '23-119': 1800 - discountSale,
}

export const cityZones = {
  'Оренбург': [[46.2792, 44.1817], [46.3784, 44.3601]],
  'Бузулук': [[48.452, 44.3258], [48.8889, 44.6876]],
  'Самара': [[46.2492, 47.9105], [46.4708, 48.203]],
  'Курумоч': [[47.1533, 39.4045], [47.3687, 39.8515]],
  'Тольятти': [[47.1533, 39.4045], [47.3687, 39.8515]],
  'Екатеринбург': [[47.1533, 39.4045], [47.3687, 39.8515]],
  // нужно заменить [[lat_min, lng_min], [lat_max, lng_max]]
};

export const fastAccessLocation = {
  'Оренбург': [
    { value: "ТРЦ Север", fullAddress: "Россия, Оренбургская область, Оренбург, просп. Дзержинского, 23 (2 вход со стороны Театральной)" },
    { value: "ТРЦ Восход", fullAddress: "Россия,Оренбургская область, Оренбург, просп. Победы, 1 (напротив KFC)" },
    { value: "ТРЦ Три мартышки", fullAddress: "Россия, Оренбургская область, Оренбург, просп. Гагарина, 48/3 (на парковке)" },
  ],
  'Бузулук': [
    { value: "ж/д Вокзал", fullAddress: "Россия, Оренбургская область, Бузулук, просп. Дзержинского, 23 (2 вход со стороны Театральной)" },
    { value: "Успех", fullAddress: "Россия, Оренбургская область, Бузулук, 4-ый микр., 16" },
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
