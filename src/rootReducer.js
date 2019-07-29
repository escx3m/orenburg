import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { trips } from './containers/SearchPage/reducers';

export default combineReducers({
  trips,
  form: formReducer
});
