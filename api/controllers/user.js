'use strict'

const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')
const mongoosePaginate = require('mongoose-pagination')
const fs = require('fs')
const path = require('path');

//Models
const User = require('../models/user')
const Follow = require('../models/follow')
const Publication = require('../models/publication')

const helpers = require('../helpers/helpers')

function home(request, response) 
{
    response.status(200).send({
        message: 'Hello World',
    })
}

function test(request, response)
{
    console.log(request.body)
    response.status(200).send({
        message: 'Applying a test for validating the routes',
    })
}

function saveUser(request, response)
{   
    const params = request.body
    const user = new User()

    if(params.name && params.surname && params.nick && params.password && params.email)
    {
        user.name = params.name
        user.surname = params.surname
        user.nick = params.nick.toLowerCase()
        user.email = params.email.toLowerCase()
        user.role = 'ROLE_USER'
        user.image = null


        //Validating duplicated users
        User.findOne({ $or: [
            {'email': user.email.toLowerCase()}, 
            {'nick': user.nick.toLowerCase()}
        ]})
        .exec(
            (error, users) =>
            {
                if (error) return response.status(500).send({
                    message: 'Error at requesting the user data'
                })

                if (users) 
                {
                    return response.status(200).send({
                        message: 'Duplicated User'
                    })
                }
                else
                {
                    // Cipher Password
                    bcrypt.hash(params.password, null, null, (error, hash) =>
                    {
                        user.password = hash

                        user.save((error, userStored) => {
                            if(error) return response.status(500).send({ message: 'Error when saving the user' })

                            if(userStored)
                            {
                                response.status(200).send({ user: userStored})
                            }
                            else
                            {
                                response.status(404).send({message: 'The User has not been registered'})
                            }
                        })
                    })
                }
            }
        )

        
    }
    else
    {
        response.status(200).send({
            message: 'Fill all the neccesary fields',
        })
    }
}

function loginUser(request, response)
{
    const params = request.body

    const email = params.email
    const password = params.password

    User.findOne({
        'email': email.toLowerCase(),
    })
    .exec(
        (error, user) =>
        { 
            if(error) return response.status(500).send({
                message: 'Error at requesting the user data'
            })

            if(user === null)
            {
                return response.status(200).send({
                    message: 'Invalid Email or Password'
                })
            }

            bcrypt.compare(password, user.password, function(error, validPassword) {
                
                if(validPassword) 
                {
                    //Return user data
                    if(params.gettoken)
                    {
                        // Generate and return Token
                        return response.status(200).send({ token: jwt.createToken(user) })
                    }
                    else
                    {
                        //Avoid sending password when the user signin to the frontend
                        user.password = undefined

                        return response.status(200).send({ user })
                    }
                }
                else
                {
                    return response.status(404).send({ message: 'The user cannot being identified' })
                }
    
            });
        }
    )
}

// Get user data
function getUser(request, response)
{
    // When we receive data from the url, we use the params object. Also, if we receive data from request body, we use request.body
    let userId = request.params.id

    User.findById(userId, (error, user) =>
    {
        if(error) return response.status(500).send({ message: 'Error on the request' })

        if(!user) return response.status(404).send({ message: 'The user does not exist' })

        followThisUser(request.user.sub, userId).then((value) =>
        {
            user.password = undefined

            return response.status(200).send({user, 
                following: value.following,
                followed: value.followed, })
        })
    })
}

//This function is to avoid callback hell
async function followThisUser(identity_user_id, user_id) {
    let following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
    let followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {
        console.log(follow);
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
 
    return {
        following: following,
        followed: followed
    }
}

// Return a list of paginated users
function getUsers(request, response)
{
    const identityUserId = request.user.sub

    let page = 1
    if(request.params.page)
    {
        page = request.params.page
    }

    const itemsPerPage = 5

    //Find get all items from the matching query on mongodb
    User.find().sort('_id').paginate(page, itemsPerPage, (error, users, total) =>
    {
        if(error) return response.status(500).send({message: 'Error on the request'})

        if(!users) return response.status(404).send({message: 'There are no avalaible users'})

        followUserIds(identityUserId).then((value) =>
        {
            return response.status(200).send(
            {
                users, 
                userFollowing: value.following, 
                usersFollowMe: value.followed, 
                total, 
                pages: Math.ceil(total / itemsPerPage)
            })
        })     
    })
}

async function followUserIds(userId)
{
    const following = await Follow.find({'user': userId}).select({'_id': 0, '_v': 0, 'user': 0}).exec().then( (follows) =>
    {
        const followsClean = []

        follows.forEach((follow) => followsClean.push(follow.followed))

        return followsClean
    })
    .catch((error) => handleError(error))

    const followed = await Follow.find({'followed': userId}).select({'_id': 0, '_v': 0, 'followed': 0}).exec().then( (follows) =>
    {
        const followsClean = []

        follows.forEach((follow) => followsClean.push(follow.user))

        return followsClean
    })
    .catch((error) => handleError(error))

    return {
        following,
        followed
    }
}

function getCounters(request, response)
{
    let userId = request.user.sub

    if(request.params.id)
    {
        userId = request.user.id
    }
    
    getCountFollow(request.params.id).then((value) =>
    {
        return response.status(200).send({'following': value.following, 'followed': value.followed, 'publications': value.publications })
    })
}

async function getCountFollow(userId)
{
    // Using countDocuments instead of counts because the last one is deprecated
    const following = await Follow.countDocuments({'user': userId}).exec().then((count) =>
    {
        return count
    })
    .catch((error) => handleError(error))

    const followed = await Follow.countDocuments({'followed': userId}).exec().then((count) =>
    {
        return count
    })
    .catch((error) => handleError(error))

    const publications = await Publication.countDocuments({'user': userId}).exec().then((count) =>
    {
        return count
    })
    .catch((error) => handleError(error))

    return {
        followed,
        following,
        publications
    }
}

function updateUser(request, response)
{
    const userId = request.params.id
    const update = request.body

    // Delete password property
    update.password = undefined

    // request.user.sub is the user _id on the db
    if(userId != request.user.sub)
    {
        return response.status(500).send({message: 'You do not have permissions to update data from the user'}) 
    }

    // Avoid duplicating an email or nickname
    User.find({ $or: [
        {'email': update.email.toLowerCase()}, 
        {'nick': update.nick.toLowerCase()}
    ]}).exec()
    .then( (users) =>
    {   
        let user_isset = false

        users.forEach((user) => 
        {
            if(user && user._id != userId) user_isset = true
        })

        if(user_isset) return response.status(200).send({ message: 'The data is already in use'})
        
        User.findByIdAndUpdate(userId, { $set: { name: update.name, surname: update.surname, nick: update.nick, email: update.email }}, 
            {new: true}, (error, userUpdated) =>
        {
            if(error) return response.status(500).send('Error on the request')
    
            if(!userUpdated) return response.status(404).send({ message: 'The user cannot be updated' })
    
            // Mongoose returns the original user when updating it
            return response.status(200).send({ user: userUpdated })
        })
    })
    .catch(
        (error) => console.log(error)
    )
}

function uploadImage(request, response)
{
    const userId = request.params.id

    if(request.files)
    {
        const filePath = request.files.image.path
        const fileSplit = filePath.split('\\')

        const fileName = fileSplit[fileSplit.length - 1]

        const fileExt = fileName.split('\.')[1]

        if(userId != request.user.sub)
        {
            return helpers.removeFilesOfUploads(filePath, 'You do not have permissions to update data from the user', response)
        }    
            
        if(fileExt == 'jpg' || fileExt == 'png' || fileExt == 'gif' || fileExt == 'jpeg')
        {
            // Update Document of logued user
            User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (error, userUpdated) =>
            {
                if(error) return response.status(500).send('Error on the request')

                if(!userUpdated) return response.status(404).send({ message: 'The user cannot be updated' })

                // Mongoose returns the original user when updating it
                return response.status(200).send({ user: userUpdated })
            })
        }
        else
        {
            return helpers.removeFilesOfUploads(filePath, 'The extension is not valid', response)
        }
    }
    else
    {
        return response.status(500).send({message: 'There are no uploaded files'})
    }
}

function getImageFile(request, response)
{
    const imageFile = request.params.imageFile
    const pathFile = './uploads/users/'  + imageFile

    fs.exists(pathFile, (exists) =>
    {
        if(exists)
        {
            //This is a express method
            response.sendFile(path.resolve(pathFile))
        } 
        else
        {
            response.status(200).send({ message: 'The image does not exists' })
        }
    })
}

module.exports = {
    home,
    test,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}