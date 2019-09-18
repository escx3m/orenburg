import {
  ADD_PASSENGER,
  REMOVE_PASSENGER,
  UPDATE_PASSENGER,
  SEND_ORDER,
  SEND_ORDER_SUCCESS,
  SEND_ORDER_ERROR,
  MAKE_PAYMENT,
  MAKE_PAYMENT_SUCCESS,
  MAKE_PAYMENT_ERROR,
  RESET,
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

export const passangersReset = () => ({
  type: RESET
});

export const sendOrder = (orderData, redirectToSuccessPage) => dispatch => {
  dispatch(makePaymentStart(orderData));
  api.sendOrder(orderData).then(
    result => {
      const { confirmation_url } = result.data.confirmation;
      window.open(confirmation_url, '_self');
      dispatch(sendOrderSuccess(result));
    },
    error => dispatch(sendOrderError(error))
  );
}

export const makePaymentStart = data => ({
  type: MAKE_PAYMENT,
  idempotenceKey: data.idempotenceKey
});

export const makePaymentSuccess = () => ({
  type: MAKE_PAYMENT_SUCCESS,
});

export const makePaymentError = () => ({
  type: MAKE_PAYMENT_ERROR,
});

export const makePayment = data => dispatch => {
  dispatch(makePaymentStart(data));
  api.makePayment(data)
  .then(result => {
      console.log('actions makePayment', result);
      const { confirmation_url } = result.data.confirmation;
      window.open(confirmation_url, '_self');
      dispatch(makePaymentSuccess());
    })
    .catch(error => dispatch(makePaymentError(error)));
}
