'use strict'

const path = require('path')
const fs = require('fs')
const moment = require('moment')
const mongoosePagination = require('mongoose-pagination')

//Models
const User = require('../models/user')
const Follow = require('../models/follow')
const Message = require('../models/message')

function messageTest(request, response)
{
    return response.status(200).send({ message: 'Testing message routes' })
}

function saveMessage(request, response)
{
    const params = request.body
    
    if(!params.text || !params.receiver) return response.status(200).send({ message: 'Fill the necessary fields' })

    const message = new Message()
    message.emitter = request.user.sub
    message.text = params.text
    message.receiver = params.receiver
    message.created_at = moment().unix()
    message.viewed = false

    message.save((error, messageStored) => 
    {
        if(error) return response.status(500).send({ message: 'Error on the request' })

        if(!messageStored) return response.status(500).send({ message: 'Error at sending the message' })

        return response.status(200).send({message: messageStored})
    })
}

function getReceivedMessage(request, response)
{
    const userId = request.user.sub

    let page = 1
    if(request.params.page) page = request.params.page

    let itemsPerPage = 4

    //Find the message that the user has received
    // In populate, you can use a second argument to select the specific properties that you want back from the object
    Message.find({receiver: userId}).populate('emitter', 'name surname image nick _id').paginate(page, itemsPerPage, (error, messages, total) =>
    {
        if(error) return response.status(500).send({ message: 'Error at getting message' })

        if(!messages) response.status(404).send({message: 'There are no messages'})
        
        return response.status(200).send(
        { 
            total: total, 
            page: Math.ceil(total/itemsPerPage), 
            messages
        })
    })
}

function getEmittedMessage(request, response)
{
    const userId = request.user.sub

    let page = 1
    if(request.params.page) page = request.params.page

    let itemsPerPage = 4

    //Find the message that the user has emitted a message
    // In populate, you can use a second argument to select the specific properties that you want back from the object
    Message.find({emitter: userId}).populate('emitter receiver', 'name surname image nick _id').paginate(page, itemsPerPage, (error, messages, total) =>
    {
        if(error) return response.status(500).send({ message: 'Error at getting message' })

        if(!messages) response.status(404).send({message: 'There are no messages'})
        
        return response.status(200).send(
        { 
            total: total, 
            page: Math.ceil(total/itemsPerPage), 
            messages
        })
    })
}

function getUnviewedMessage(request, response)
{
    const userId = request.user.sub

    Message.count({ receiver: userId, viewed: 'false' }).exec((error, count) =>
    {
        if(error) return response.status(500).send({ message: 'Error on the request' })

        return response.status(200).send({ 'unviewed': count })
    })
}

function setViewedMessage(request,response)
{
    const userId = request.user.sub

    Message.update({receiver: userId, viewed: false}, {viewed: true}, {'multi': true}, (error, messageUpdate) =>
    {
        if(error) return response.status(500).send({message: 'Error on the request'})

        return response.status(200).send({message: messageUpdate})
    })
}

module.exports = {
    messageTest,
    saveMessage,
    getReceivedMessage,
    getEmittedMessage,
    getUnviewedMessage,
    setViewedMessage
}   