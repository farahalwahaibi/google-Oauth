'use strict';

const express = require( 'express' );
const cors = require( 'cors' );
const morgan = require( 'morgan' );

const notFoundHandler = require( '../src/error-handlers/404.js' );
const errorHandler = require( '../src/error-handlers/500.js' );
// const logger = require( '../src/auth/middleware/logger.js' );
const authRoutes = require( '../src/auth/route.js' );
const v1Routes = require( '../src/routes/v1.js' );
const v2Routes = require( '../src/routes/v2.js' );

const app = express();

app.use( cors() );
app.use( morgan( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( express.static( './public' ) );
// app.use( logger );

app.use( authRoutes );
app.use( '/api/v1', v1Routes );
app.use( '/api/v2', v2Routes );


app.use( '*', notFoundHandler );
app.use( errorHandler );

module.exports = {
  server: app,
  start: port => {
    if ( !port ) { throw new Error( 'Missing Port' ); }
    app.listen( port, () => console.log( `Listening on ${port}` ) );
  },
};
