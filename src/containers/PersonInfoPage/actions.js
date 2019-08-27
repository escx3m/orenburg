import {
  ADD_PASSENGER,
  REMOVE_PASSENGER,
  UPDATE_PASSENGER,
  SEND_ORDER,
  SEND_ORDER_SUCCESS,
  SEND_ORDER_ERROR,
} from './constants';
import api from '../../api';

export const addPassenger = values => ({
  type: ADD_PASSENGER,
  values,
});

export const removePassenger = index => ({
  type: REMOVE_PASSENGER,
  index,
});

export const updatePassenger = (index, values) => ({
  type: UPDATE_PASSENGER,
  index,
  values,
});

export const sendOrderStart = trips => ({
  type: SEND_ORDER,
});

export const sendOrderSuccess = trips => ({
  type: SEND_ORDER_SUCCESS,
});

export const sendOrderError = trips => ({
  type: SEND_ORDER_ERROR,
});

export const sendOrder = (passengers, redirectToSuccessPage) => dispatch => {
  dispatch(sendOrderStart());
  api.sendOrder(passengers).then(
    result => {
      redirectToSuccessPage();
      dispatch(sendOrderSuccess(result));
    },
    error => dispatch(sendOrderError(error))
  );
}
