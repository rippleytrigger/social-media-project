'use strict'

const express = require('express')
const followController = require('../controllers/follow')

const api = express.Router()

const mdAuth = require('../middlewares/authenticated')

api.post('/follow', mdAuth.ensureAuth, followController.saveFollow)
api.delete('/follow/:id', mdAuth.ensureAuth, followController.deleteFollow)
// Question mark means optional argument
api.get('/following/:id?/:page?', mdAuth.ensureAuth, followController.getFollowingUsers)
api.get('/followed/:id?/:page?', mdAuth.ensureAuth, followController.getFollowedUsers)
api.get('/get-my-followers/:followed?', mdAuth.ensureAuth, followController.getMyfollowers)

module.exports = api