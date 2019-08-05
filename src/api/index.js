import axios from 'axios';

const getTrips = (data) => {
  return axios.post('http://localhost:5000/api/trips', { data }).then(res => res.data )
}

export default {
  trips: {
    get: getTrips
  }
}
