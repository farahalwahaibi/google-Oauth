'use strict';

require('dotenv').config();

const superagent = require('superagent');
const User = require('./models/users.js');

const tokenServerUrl = 'https://accounts.google.com/o/oauth2/token';
const remoteAPI = 'https:­//a­cco­unt­s.g­oog­le.c­om­/o/­oau­th2­/auth';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


module.exports = async (req, res, next) => {
    try {
        const code = req.query.code;
        const remoteToken = await exchangeCodeForToken(code);
        const remoteUser = await getRemoteUserInfo(remoteToken);
        const [user, token] = await getUser(remoteUser);

        req.user = user;
        req.token = token;
        next();

    } catch (error) {
        next(error.message);
    }
};

async function exchangeCodeForToken(code) {
    const tokenResponse = await superagent.post(tokenServerUrl)
        .send({ code: code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT_URI, grant_type: 'authorization_code', });

    const accessToken = tokenResponse.body.access_token;
    return accessToken;
}

async function getRemoteUserInfo(token) {
    const userResponse = await superagent.get(remoteAPI)
        .set('Authorization', `token ${token}`).set('user-agent', 'express-app');

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
//         [data.code, data.client_id, data.client_secret, data.redirect_uri]

//     try {
//         const token = await superagent.post(tokenServerUrl)
//         .send(queryString)
//     } catch (error) {
        
//     }
// }