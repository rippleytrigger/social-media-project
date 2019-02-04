'use strict'

const express = require('express')
const multipart = require('connect-multiparty')

const api = express.Router()

//Controllers
const PublicationController = require('../controllers/publication')

//Middlewares
const MdAuth = require('../middlewares/authenticated')
const mdUpload = multipart({ uploadDir: './uploads/publications'})

api.get('/publication-test', MdAuth.ensureAuth, PublicationController.publicationTest)
api.post('/publication', MdAuth.ensureAuth, PublicationController.savePublications)
api.get('/publication/:id', MdAuth.ensureAuth, PublicationController.getPublication)
api.get('/publications/:page?', MdAuth.ensureAuth, PublicationController.getPublications)
api.get('/publications-user/:user/:page?', MdAuth.ensureAuth, PublicationController.getPublicationsUser)
api.delete('/publication/:id', MdAuth.ensureAuth, PublicationController.deletePublication)
api.post('/upload-image-pub/:id', [MdAuth.ensureAuth, mdUpload], PublicationController.uploadImage)
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile)

module.exports = api