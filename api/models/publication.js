'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PublicationSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    text: String,
    file: String,
    created_at: String,
})

// Se puede exportar un array o un objecto
//El primer parametro es pluralizado a nivel de bd y llevado a minusculas
// User, users
module.exports = mongoose.model('Publication', PublicationSchema)