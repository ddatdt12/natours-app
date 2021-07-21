/*  eslint-disable  */

import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    const res = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(res.data);
    if (res.data.status === 'success') {
      location.assign(res.data.session.url);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error.data.message);
  }
};
