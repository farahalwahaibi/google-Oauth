'use strict';

require('dotenv').config();

const jwt = require('jsonwebtoken');
const superagent = require('superagent');
const User = require('./models/users.js');
const queryString = require('querystring');
const { response } = require('express');

const remoteAPI = 'https://accounts.google.com/o/oauth2/token';
const tokenServerUrl = 'https://accounts.google.com/o/oauth2/token';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


module.exports = async (req, res, next) => {
    try {
        const code = req.query.code;
        console.log(code,'code');
        const remoteToken = await exchangeCodeForToken(code);
        console.log(remoteToken,'remotE');
        const remoteUser = await getRemoteUserInfo(remoteToken);
        console.log(remoteUser,'USER');
        const [user, token] = await getUser(remoteUser);

        req.user = user;
        req.token = token;
        next();

    } catch (error) {
        res.send(error);
    }
};

async function exchangeCodeForToken(code) {
    
    
        const tokenResponse = await superagent.post(tokenServerUrl)
            .send({ code: code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT_URI, grant_type: 'authorization_code' })
            .set('Content-Type', 'application/x-www-form-urlencoded');
            console.log('in exchange');
            console.log (tokenResponse , 'token response');
        const accessToken = tokenResponse.body.access_token;
        console.log(accessToken,'accessToken');
        return accessToken;
   

}

async function getRemoteUserInfo(token) {
    const userResponse = await superagent.get(remoteAPI)
        .set('Authorization', `Bearer ${token}`).set('user-agent', 'express-app');

    const user = userResponse.body;
    return user;
}

async function getUser(remoteUser) {
    const user = { username: remoteUser.login, password: 'this_should_be_empty' };
    const userObj = new User(user);
    const userDoc = userObj.save();
    const token = userDoc.token;

    return [user, token];
}

// async function getAccessToken(data) {
//     const { code, client_id, client_secret, redirect_uri } =
//         [data.code, data.client_id, data.client_secret, data.redirect_uri];
//     const obj = {cod:code , client_id : client_id, client_secret: client_secret, redirect_uri: redirect_uri , type: 'authorization_code'}

//     try {
//         const token = await superagent.post(tokenServerUrl)
//         .send(queryString.stringify(obj)).set('Content-Type','application/x-www-form-urlencoded');
//         return token.body ;
//     } catch (error) {
//         console.log(error);
//     }
// }