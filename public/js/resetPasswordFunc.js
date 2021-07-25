/*  eslint-disable  */
import axios from 'axios';
import { showAlert } from './alerts';

export const sendResetEmail = async email => {
  let status;
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email
      }
    });
    status = 'success';
  } catch (error) {
    status = 'error';
    showAlert('error', error.response.data.message);
  }
  return status;
};

export const resetPassword = async (newPassword, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password: newPassword,
        passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', "You've successfully changed your password");
      window.setTimeout(() => {
        location.assign('/login');
      }, 2000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
