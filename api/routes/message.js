'use strict'

const express = require('express')
const multipart = require('connect-multiparty')

const api = express.Router()

//Controllers
const MessageController = require('../controllers/message')

//Middlewares
const MdAuth = require('../middlewares/authenticated')
const mdUpload = multipart({ uploadDir: './uploads/publications'})

api.get('/message-test', MdAuth.ensureAuth, MessageController.messageTest)
api.post('/message', MdAuth.ensureAuth, MessageController.saveMessage)
api.get('/my-messages/:page?', MdAuth.ensureAuth, MessageController.getReceivedMessage)
api.get('/messages/:page?', MdAuth.ensureAuth, MessageController.getEmittedMessage)
api.get('/unviewed-messages', MdAuth.ensureAuth, MessageController.getUnviewedMessage)
api.get('/set-viewed-messages', MdAuth.ensureAuth, MessageController.setViewedMessage)

module.exports = api