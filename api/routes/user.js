'use strict'

const express = require('express')
const multipart = require('connect-multiparty')

const api = express.Router()

//Controllers
const UserController = require('../controllers/user')

//Middlewares
const mdAuth = require('../middlewares/authenticated')
const mdUpload = multipart({ uploadDir: './uploads/users'})

api.get('/home', UserController.home)
api.get('/test', mdAuth.ensureAuth, UserController.test)
api.post('/register', UserController.saveUser)
api.post('/login', UserController.loginUser)
api.get('/user/:id', mdAuth.ensureAuth, UserController.getUser)
api.get('/users/:page?', mdAuth.ensureAuth, UserController.getUsers)
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser)
api.post('/upload-image-user/:id', [mdAuth.ensureAuth, mdUpload], UserController.uploadImage)
api.get('/get-image-user/:imageFile', UserController.getImageFile)
api.get('/counters/:id?', mdAuth.ensureAuth, UserController.getCounters)

module.exports = api