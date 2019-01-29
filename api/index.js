'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const port = 3800

mongoose.promise = global.promise
mongoose.connect('mongodb://localhost:27017/social_media_project', { useNewUrlParser: true })
    .then(
        () =>
        {
            console.log('+The conection to the database has sucessfully been made')
       
            // Create Server
            app.listen(port, () =>
            {
                console.log(`Server running on http://localhost:${port}`)
            })
        }
    )
    .catch(
        (err) =>
        {
            console.log('There was an error with the database conection: ' + err)
        }
    )