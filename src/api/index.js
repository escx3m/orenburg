import axios from "axios";

const getTrips = data => {
  return axios.post("/api/trips", { data }).then(res => res.data);
};

const sendOrder = async data => {
  const result = axios.post("/api/order", { data }).then(res => res);
  return result;
};

export default {
  trips: {
    get: getTrips
  },
  sendOrder
};
