import {
  ADD_PASSENGER,
  REMOVE_PASSENGER,
  UPDATE_PASSENGER,
  SEND_ORDER,
  SEND_ORDER_SUCCESS,
  SEND_ORDER_ERROR,
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

export const sendOrderStart = data => ({
  type: SEND_ORDER,
  idempotenceKey: data.idempotenceKey
});

export const sendOrderSuccess = () => ({
  type: SEND_ORDER_SUCCESS,
});

export const sendOrderError = () => ({
  type: SEND_ORDER_ERROR,
});

export const passangersReset = () => ({
  type: RESET
});

export const sendOrder = (orderData, redirectToSuccessPage) => dispatch => {
  dispatch(sendOrderStart(orderData));
  // console.log('ORDERDATA', orderData)
  api.sendOrder(orderData).then(
    result => {
      console.log('reuslt', result.data)
      const { formUrl } = result.data;
      window.open(formUrl, '_self');
      dispatch(sendOrderSuccess(result));
    },
    error => dispatch(sendOrderError(error))
  );
}
