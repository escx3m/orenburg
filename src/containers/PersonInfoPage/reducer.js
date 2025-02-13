import {
  ADD_PASSENGER,
  REMOVE_PASSENGER,
  UPDATE_PASSENGER,
  SEND_ORDER,
  SEND_ORDER_SUCCESS,
  SEND_ORDER_ERROR,
  RESET,
} from './constants';

export const passengers = (state = [], action) => {
  switch(action.type) {
    case ADD_PASSENGER: {
      const { values } = action;
      return [ ...state, { ...values }];
    }
    case REMOVE_PASSENGER: {
      const { index } = action;
      return state.filter((item, i) => i !== index);
    }
    case UPDATE_PASSENGER: {
      const { index, values } = action;
      return state.map(
        (item, i) => {
          return i === index ? values : item;
        }
      );
    }
    case RESET: {
      return [];
    }
    default: return state;
  }
};

const initialState = {
  idempotenceKey: '',
  loading: false,
  error: '',
};

export const payment = (state = initialState, action) => {
  switch(action.type) {
    case SEND_ORDER: {
      return {
        ...state,
        loading: true,
        idempotenceKey: action.idempotenceKey,
        error: ''
      };
    }
    case SEND_ORDER_SUCCESS: {
      return {
        ...state,
        loading: false,
        idempotenceKey: '',
        error: ''
      };
    }
    case SEND_ORDER_ERROR: {
      const { error } = action;
      return { ...state, loading: false, error };
    }
    case 'reset': {
      return initialState;
    }
    default: return state;
  }
};

