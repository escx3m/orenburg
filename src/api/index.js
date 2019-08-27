import axios from 'axios';

const getTrips = (data) => {
  return axios.post('/api/trips', { data }).then(res => res.data )
}

const sendOrder = (data) => {
  console.log('send order', data);
  return axios.post('/api/order', { data }).then(res => res.data )
}

const sendOrder = (data) => {
  console.log('send order', data);
  return axios.post('http://localhost:5000/api/order', { data }).then(res => res.data )
}

export default {
  trips: {
    get: getTrips
  },
  sendOrder
}
