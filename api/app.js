'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// Load Routes
const user_routes = require('./routes/user')
const follow_routes = require('./routes/follow')
const publication_routes = require('./routes/publication')
const message_routes = require('./routes/message')

// Middlewares
// Método que se ejecuta antes de que llegue a un controlador
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// CORS
// This is a middleware that is going to allow the ajax request from angular properly
app.use((request, response, next) => {
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	response.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});

// Routes
// Con .use, el middleware siempre se va a ejecutar antes que la acción del controlador
app.use('/api', user_routes)
app.use('/api', follow_routes)
app.use('/api', publication_routes)
app.use('/api', message_routes)

// Cada fichero creado va a ser un módulo que podemos importar
module.exports = app