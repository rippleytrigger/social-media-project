'use strict'

//const path = require('path')
//const fs = require('fs')

const mongoosePaginate = require('mongoose-pagination')

const User = require('../models/user')
const Follow = require('../models/follow')


function saveFollow(request, response)
{
    const params = request.body
    const follow = new Follow()

    follow.user = request.user.sub
    follow.followed = params.followed

    follow.save((error, followStored) => 
    {
        if (error) return response.status(500).send('Error at doing the request')

        if(!followStored) return response.status(404).send('The following has not being stored') 

        return response.status(200).send({follow: followStored})
    })
}

function deleteFollow(request, response)
{
    const userId = request.user.sub
    const followId = request.params.id

    Follow.find({ 'user': userId, followed: followId }).remove( error => 
    {
        if(error) return response.status(500).send({message: 'Error at stop following'})

        return response.status(200).send({ message: 'The followed has being delete' })
    })
}

function getFollowingUsers(request, response)
{
    let userId = request.user.sub

    if(request.params.id && request.params.page)
    {
        userId = request.params.id
    }

    let page = 1
    if(request.params.page)
    {
        page = request.params.page
    }
    else
    {
        page = request.params.id
    }

    const itemsPerPage = 4

    Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (error, follows, total) =>
    {
        if(error) return response.status(500).send({message: 'Error on the server'})

        if(!follows) return response.status(404).send({message: 'There are no followed users'})

        followUserIds(request.user.sub).then((value) =>
        {
            return response.status(200).send
            ({ 
               total, 
               pages: Math.ceil(total/itemsPerPage),
               follows, 
               userFollowing: value.following, 
               usersFollowMe: value.followed,  
            })
        })
    })
}

// Se puede hacer un servicio para evitar la duplicacion de metodos
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

function getFollowedUsers(request, response)
{
    let userId = request.user.sub

    if(request.params.id && request.params.page)
    {
        userId = request.params.id
    }

    let page = 1
    if(request.params.page)
    {
        page = request.params.page
    }
    else
    {
        page = request.params.id
    }

    const itemsPerPage = 4

    Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (error, follows, total) =>
    {
        if(error) return response.status(500).send({message: 'Error on the server'})

        if(!follows) return response.status(404).send({message: 'No users are following you'})

        followUserIds(request.user.sub).then((value) =>
        {
            return response.status(200).send
            ({ 
               total, 
               pages: Math.ceil(total/itemsPerPage),
               follows, 
               userFollowing: value.following, 
               usersFollowMe: value.followed,  
            })
        })
    })
}


function getMyfollowers(request, response)
{
    const userId = request.user.sub

    // Returns the followings
    let find = Follow.find({ user: userId })

    // If this is true, it return the followers
    if(request.params.followed)
    {
        find = Follow.find({ followed: userId })
    }

    find.populate('user followed').exec().then(
        follows =>
        {
            if(!follows) return response.status(404).send({ message: 'You are not following any user' })

            return response.status(200).send({ follows })
        }

    ).catch(error => { return response.status(500).send({ message: 'Server Error' }) })
}

function getYourfollowers(request, response)
{
    const userId = request.user.sub

    Follow.find({ user: userId }).populate('user followed').exec((error, follows) =>
    {
        if(error) return response.status(500).send({ message: 'Server Error' })

        if(!follows) return response.status(404).send({ message: 'You are not following any user' })

        return response.status(200).send({ follows })
    })
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyfollowers,
    getYourfollowers
}