/*  eslint-disable  */

console.log('FB logging...');
window.fbAsyncInit = function() {
  FB.init({
    appId: '{your-app-id}',
    cookie: true,
    xfbml: true,
    version: '{api-version}'
  });

  FB.AppEvents.logPageView();
};

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

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
