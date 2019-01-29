'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FollowSchema = Schema({
    followed: {type: Schema.ObjectId, ref: 'User'},
    user: {type: Schema.ObjectId, ref: 'User'},
})

// Se puede exportar un array o un objecto
//El primer parametro es pluralizado a nivel de bd y llevado a minusculas
// User, users
module.exports = mongoose.model('Follow', FollowSchema)