'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = Schema({
    text: String,
    viewed: Boolean,
    emitter: { type: Schema.ObjectId, ref: 'User'},
    receiver: { type: Schema.ObjectId, ref: 'User'},
    created_at: String
})

// Se puede exportar un array o un objecto
//El primer parametro es pluralizado a nivel de bd y llevado a minusculas
// User, users
module.exports = mongoose.model('Message', MessageSchema)