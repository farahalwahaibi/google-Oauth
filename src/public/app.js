'use strict';

const authorizeUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
// const queryString = require ('querystring');
const options = {
  client_id: '288561657232-kfgo2ht10mg6gftdln074en89ntq56he.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/userinfo.profile',
  state: 'some_random_string',
  redirect_uri : 'http://localhost:4000/oauth/google',
  response_type: 'code'
};

const queryString = Object.keys( options )
  .map( ( val ) => {
    return `${val}=${encodeURIComponent( options[val] )}`;

  } )
  .join( '&' );

const authUrl = `${authorizeUrl}?${queryString}`;

const aTag = document.getElementById( 'oauth' );
aTag.setAttribute( 'href', authUrl );

