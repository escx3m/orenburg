import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { trips } from './containers/SearchPage/reducer';
import { passengers } from './containers/PersonInfoPage/reducer';

export default combineReducers({
  trips,
  passengers,
  form: formReducer
});
