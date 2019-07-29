import axios from 'axios';

const getTrips = (params) => {
  return axios.get('http://localhost:5000/api/trips', { params }).then(res => res.data )
}

export default {
  trips: {
    get: getTrips
  }
}
