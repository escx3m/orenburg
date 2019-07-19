import axios from 'axios';

export default {
  trips: {
    get: (credentials) => axios.get('http://localhost:5000/api/trips', { credentials }).then(res => res.data )
  }
}
