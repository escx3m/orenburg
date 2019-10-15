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
  '166-10': 800 - discountSale,
  '10-166': 800 - discountSale,
  '166-10air': 900 - discountSale,
  '10air-166': 900 - discountSale,
  '119-166': 1000 - discountSale,
  '166-119': 1000 - discountSale,
  '119air-166': 1000 - discountSale,
  '166-119air': 1000 - discountSale,
  '23-166': 800 - discountSale,
  '166-23': 800 - discountSale,
  '23air-166': 900 - discountSale,
  '166-23air': 900 - discountSale,
  '23-10': 1000 - discountSale,
  '10-23': 1000 - discountSale,
  '23air-10': 1200 - discountSale,
  '10-23air': 1200 - discountSale,
  '119-23': 1800 - discountSale,
  '23-119': 1800 - discountSale,
}

export const cityZones = {
  'Элиста': [[46.2792, 44.1817], [46.3784, 44.3601]],
  'Волгоград': [[48.452, 44.3258], [48.8889, 44.6876]],
  'Астрахань': [[46.2492, 47.9105], [46.4708, 48.203]],
  'Ростов-на-Дону': [[47.1533, 39.4045], [47.3687, 39.8515]],
};

export const fastAccessLocation = {
  'Элиста': [
    { value: "Автовокзал", fullAddress: "Россия, Республика Калмыкия, Элиста, Привокзальная площадь, 1" },
    { value: "Гостиница Элиста", fullAddress: "Россия, Республика Калмыкия, Элиста, улица В. И. Ленина, 241" },
    { value: "Гостиница Белый лотос", fullAddress: "Россия, Республика Калмыкия, Элиста, улица Хонинова, 7" },
    { value: "Гостница Азия", fullAddress: "Россия, Республика Калмыкия, Элиста, улица Хрущёва, 6А" },
    { value: "Пагода Семи Дней", fullAddress: "Россия, Республика Калмыкия, Элиста, площадь Ленина" },
    { value: "Лукойл Юг", fullAddress: "Россия, Республика Калмыкия, Элиста, Лукойл Юг на объездной" },
    { value: "Марко Поло", fullAddress: "Россия, Республика Калмыкия, Элиста, квартал Сити-Чесс,  "}
  ],
  'Волгоград': [
    { value: "Аэропорт", fullAddress: "Россия, городской округ Волгоград, аэропорт Волгоград (Гумрак)" },
    { value: "Мнтк", fullAddress: "Россия, Волгоград, улица Землячки, 80" },
    { value: "Ждвокзал", fullAddress: "Россия, Приволжская железная дорога, станция Волгоград-1" },
    { value: "Автовокзал", fullAddress: "Россия, Волгоград, улица Михаила Балонина, 11" },
    { value: "ТЦ Акварель", fullAddress: "Россия, Волгоград, Университетский проспект, 107" },
    { value: "ТЦ Комсомолл", fullAddress: "Россия, Волгоград, улица Землячки, 110Б" },
    { value: "ТЦ Европа Сити Молл", fullAddress: "Россия, Волгоград, проспект имени В.И. Ленина, 54Б" },
    { value: "ТЦ Ворошиловский", fullAddress: "Россия, Волгоград, Рабоче-Крестьянская улица, 9Б" },
    { value: "СХИ", fullAddress: "Россия, Волгоград, улица Чебышева, 52А" }
  ],
  'Астрахань': [
    { value: "Аэропорт", fullAddress: "Россия, городской округ Астрахань, аэропорт Астрахань" },
    { value: "ЖД больница", fullAddress: "Россия, Астрахань, улица Сун Ят-Сена, 62" },
    { value: "Ждвокзал", fullAddress: "Россия, Астрахань, Вокзальная площадь" },
    { value: "Ярмарка", fullAddress: "Россия, Астрахань, Вокзальная площадь, 13А" },
    { value: "Онкодиспансер", fullAddress: "Россия, Астрахань, улица Бориса Алексеева, 57" },
    { value: "Автовокзал", fullAddress: "Россия, Астрахань, улица Анри Барбюса, 29В" },
    { value: "Макдональдс", fullAddress: "Россия, Астрахань, улица Анри Барбюса, 21А" },
    { value: "Кардиоцентр", fullAddress: "Россия, Астрахань, улица Покровская роща" },
    { value: "Аэропорт", fullAddress: "Россия, Астраханская область, аэропорт Астрахань" },
    { value: "Газпром клиника ", fullAddress: "Россия, Астрахань, Кубанская улица, 5" }
  ],
  'Ростов-на-Дону': [
    { value: "ТЦ Мега", fullAddress:"Россия, Ростовская область, Аксай, Аксайский проспект, 23" },
    { value: "ТЦ Горизонт", fullAddress:"Россия, Ростов-на-Дону, проспект Михаила Нагибина, 32И" },
    { value: "Главный автовокзал(на Сиверса)", fullAddress:"Россия, Ростов-на-Дону, проспект Сиверса, 3" },
    { value: "Онкоцентр", fullAddress:"Россия, Ростов-на-Дону, Нахичевань, улица 14-я Линия, 63" },
    { value: "Клиническая Больница (медцентр)", fullAddress:"Россия, Ростов-на-Дону, улица Пешкова, 34" },
    { value: "Автовокзал(на Шолохова)", fullAddress:"Россия, Ростов-на-Дону, проспект Шолохова, 126" },
    { value: "Аэропорт(Платов)", fullAddress:"Россия, Ростовская область, Аксайский район, аэропорт Платов" },
    { value: "ТЦ Золотой Вавилон", fullAddress:"Россия, Ростов-на-Дону, улица Малиновского, 25" },
    { value: "МедУнивер", fullAddress:"Россия, Ростов-на-Дону, Нахичеванский переулок, 29" },
    { value: "Визовый Центр", fullAddress:"Россия, Ростов-на-Дону, Троллейбусная улица, 24/2В" },
    { value: "ЖД Вокзал", fullAddress:"Россия, Ростов-на-Дону, Привокзальная площадь" },
  ]
};
