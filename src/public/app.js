'use strict';

const authorizeUrl = 'https:­//a­cco­unt­s.g­oog­le.c­om­/o/­oau­th2­/auth';

const options = {
  client_id: '250737487040-v6888e4ro2ob1t51bb5cnfaevmbdqaqd.apps.googleusercontent.com',
  scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'].join(' '), state: 'some_random_string'
};

const queryString = Object.keys( options ).map( ( val )=> `${val}=${encodeURIComponent( options[val] )}` )
  .join( '&' );

const authUrl = `${authorizeUrl}?${queryString}`;

const aTag = document.getElementById( 'oauth' ) ;
aTag.setAttribute( 'href',authUrl );

