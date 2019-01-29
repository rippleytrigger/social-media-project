'use strict'

const fs = require('fs')

function removeFilesOfUploads(filePath, message, response)
{
    fs.unlink(filePath, (error) =>
    {
        return response.status(200).send({ message })
    })
}

module.exports = {
    removeFilesOfUploads
}