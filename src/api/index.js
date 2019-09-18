import axios from 'axios';

const getTrips = (data) => {
  return axios.post('http://localhost:5000/api/trips', { data }).then(res => res.data )
}

const sendOrder = async (data) => {
  console.log('send order', data);
  const result = axios.post('http://localhost:5000/api/order', { data }).then(res => res )
  return result;
}

const makePayment = async (data) => {
  console.log('send payment');
  const result = await axios.post('http://localhost:5000/api/payment', { data }).then(res => res)
  console.log(result);
  return result;
}

export default {
  trips: {
    get: getTrips
  },
  sendOrder,
  makePayment
}
