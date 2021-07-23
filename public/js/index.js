/*  eslint-disable  */

import '@babel/polyfill';
import { login, logout, register } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

const map = document.getElementById('map');
const loginForm = document.getElementById('form-login');
const registerForm = document.getElementById('register-form');
const accountForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');
const logoutBtn = document.querySelector('.nav__el--logout');
const bookTourBtn = document.getElementById('book-tour');

if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (accountForm) {
  accountForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings('data', form);
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', e => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    updateSettings('password', { currentPassword, password, passwordConfirm });
  });
}

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', async e => {
    const { tourId } = e.target.dataset;
    bookTourBtn.innerText = 'Processing...';
    await bookTour(tourId);
  });
}

if (registerForm) {
  console.log(registerForm);
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    console.log(email, name, password, passwordConfirm);
    register(name, email, password, passwordConfirm);
  });
}
