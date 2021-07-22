/*  eslint-disable  */

const avatar = document.getElementById('avatar');
console.log('FB logging...');
window.fbAsyncInit = function() {
  FB.init({
    appId: '343155187453910',
    cookie: true,
    xfbml: true,
    version: 'v11.0'
  });

  FB.AppEvents.logPageView();
};

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}
const statusChangeCallback = response => {
  console.log(response);
  if (response.status === 'connected')
    FB.api(
      `/${response.authResponse.userID}/picture?type=large`,
      'GET',
      {},
      function(res) {
        avatar.scr = `${res.url}`;
      }
    );
};

(function(d, s, id) {
  let js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');
