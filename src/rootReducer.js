import { combineReducers } from 'redux';

import { trips } from './containers/SearchPage/reducer';
import { passengers, order, payment } from './containers/PersonInfoPage/reducer';

export default combineReducers({
  trips,
  passengers,
  order,
  payment
});
