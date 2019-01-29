'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')

// This string needs to be known to discover the secret. In opposite case, the token is safe.
const secret = 'secret_key_social_media_angular_course'

// This token will be use to allow access to the client to the methods that are needs login
exports.createToken = (user) => 
{
    const payload = {
        sub: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        nick: user.nick,
        role: user.role,
        image: user.image,
        createAt: moment().unix(),
        expiration: moment().add(30, 'days').unix
    }

    return jwt.encode(payload, secret)
}   