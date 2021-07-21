/*  eslint-disable  */

import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (type, data) => {
  const url = `http://localhost:3000/api/v1/users/${
    type === 'password' ? 'updateMyPassword' : 'updateMe'
  } `;
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.reload();
      }, 1000);
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (error) {
    console.log(error.response);
    showAlert('error', error.response.data.message);
  }
};
