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
  if (response.status === 'connected') {
    document.getElementById('status').innerHTML = 'We are connected';
    testAPI();
  } else {
    document.getElementById('status').innerHTML =
      'Please log ' + 'into this webpage.';
  }
};

function testAPI() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
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
