import axios from "axios";

const getTrips = data => {
  return axios
    .post("http://localhost:5000/api/trips", { data })
    .then(res => res.data);
};

const sendOrder = async data => {
  const result = axios
    .post("http://localhost:5000/api/order", { data })
    .then(res => res);
  return result;
};

export default {
  trips: {
    get: getTrips
  },
  sendOrder
};
