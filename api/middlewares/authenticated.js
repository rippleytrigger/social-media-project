'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')

// This string needs to be known to discover the secret. In opposite case, the token is safe.
const secret = 'secret_key_social_media_angular_course'


// We can add more method to this middleware by using 
//exports.method

exports.ensureAuth = (request, response, next) => {
    // Next is need to the middleware to advance to the controller

    if(!request.headers.authorization)
    {
        return response.status(403).send({message: 'The request does not have the authetication headers'})
    }

    // Using replace, it is going to replace all 
    const token = request.headers.authorization.replace('/[""]+/g', '')
    
    // Sensible to errors
    try
    {
        const payload = jwt.decode(token, secret)

        // Check if token has expired
        if(payload.expiration <= moment().unix())
        {
            return response.status(401).send({ message: 'The Token has expired'})
        }

        // Add payload to the request
        request.user = payload
        
    }
    catch(exception)
    {
        return response.status(404).send({ message: 'Token is not valid'})
    }

    
    next()
}