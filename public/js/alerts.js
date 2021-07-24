/*  eslint-disable  */

export const hideAlert = (type, message) => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is ' ' or 'error'
export const showAlert = (type, message, time = 5) => {
  hideAlert();
  const markup = `<div class='alert alert--${type}'>${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, time * 1000);
};
