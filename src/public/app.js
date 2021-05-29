'use strict';

const authorizeUrl = 'https:­//a­cco­unt­s.g­oog­le.c­om­/o/­oau­th2­/auth';

const options = {
  client_id: '190084133353-8h1knp422g6tt64kvd3gm2qbdo8b6r3c.apps.googleusercontent.com',
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join( ' ' ), 
  state: 'some_random_string'
};

const queryString = Object.keys( options )
  .map( ( val ) => {
    return `${val}=${encodeURIComponent( options[val] )}`;

  } )
  .join( '&' );

const authUrl = `${authorizeUrl}?${queryString}`;

const aTag = document.getElementById( 'oauth' );
aTag.setAttribute( 'href', authUrl );

