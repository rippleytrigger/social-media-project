'use strict'

const path = require('path')
const fs = require('fs')
const moment = require('moment')
const mongoosePagination = require('mongoose-pagination')

//Models
const Publication = require('../models/publication')
const User = require('../models/user')
const Follow = require('../models/follow')

//Helpers
const helpers = require('../helpers/helpers')

function publicationTest(request,response)
{
    Follow.find({'user': request.user.sub}).populate('followed').exec().then((follows) =>
    {
        console.log('Testing', follows)
    })
}

function savePublications(request, response)
{
    const params = request.body

    if(!params.text) return response.status(200).send({ message: 'You should send a text' })

    const publication = new Publication()
        publication.text = params.text
        publication.file = null
        publication.user = request.user.sub
        publication.created_at = moment().unix()


    publication.save((error, publicationStored) => {
        if(error) return response.status(500).send({ message: 'Error at saving the publication' })

        if(!publicationStored) response.status(404).send({message: 'The Publication has not been saved'})
        
        return response.status(200).send({ publication: publicationStored})
    })
 }

function getPublications(request, response)
{
    let page = 1

    if(request.params.page) page = request.params.page
    
    const itemsPerPage = 4

    Follow.find({'user': request.user.sub}).populate('followed').exec().then((follows) =>
    {
        let followsClean = []

        follows.forEach((follows) => 
        {
            followsClean.push(follows.followed)
        })

        Publication.find({user: {'$in': followsClean}}).sort('-created_at').populate('user')
        .paginate(page, itemsPerPage, (error, publications, total) =>
        {
            if(error) return response.status(200).send({message: 'Error at getting publications'})

            if(!publications) return response.status(404).send({message: 'There are no publications'})

            return response.status(200).send(
            { totalItems: total, 
              publications,
              pages: Math.ceil(total/itemsPerPage),
              page: page
            })
        })
    })
    .catch((error) => { if(error) return response.status(500).send({ message: 'Error at getting followings' }) })
}

function getPublication(request, response)
{
    const publicationId = request.params.id

    Publication.findById(publicationId, (error, publication) =>
    {
        if(error) return response.status(200).send({message: 'Error at getting the publication'})

        if(!publication) return response.status(404).send({message: 'The publication does not exists'})

        return response.status(200).send({ publication })
    })
}

function deletePublication(request, response)
{
    const publicationId = request.params.id

    Publication.find({user: request.user.sub, '_id': publicationId}).remove((error, publicationRemoved) =>
    {
        if(error) return response.status(500).send({ message: 'Error at deleting the publication' })

        if(!publicationRemoved) return response.status(404).send({ message: 'The publication has not been deleted' })

        return response.status(200).send({publication: 'Publication sucessfully deleted'})
    })
}

function uploadImage(request, response)
{
    const publicationId = request.params.id

    if(request.files)
    {
        const filePath = request.files.image.path
        const fileSplit = filePath.split('\\')
        const fileName = fileSplit[fileSplit.length - 1]
        const fileExt = fileName.split('\.')[1]

        if(fileExt == 'jpg' || fileExt == 'png' || fileExt == 'gif' || fileExt == 'jpeg')
        {
            // This query is for validating is the publication belongs to the user
            Publication.findOne({'user': request.user.sub, '_id': publicationId }).exec((error, userPublication) =>
            {
                // If the publication does not belong to the user, alert him and return the function
                if(!userPublication) return helpers.removeFilesOfUploads(filePath, 'You do not have permissions to modify this publication', response) 

                // Update Document of publication
                Publication.findByIdAndUpdate(publicationId, {file: fileName}, {new: true}, (error, publicationUpdated) =>
                {
                    if(error) return response.status(500).send('Error on the request')

                    if(!publicationUpdated) return response.status(404).send({ message: 'The publication cannot be updated' })

                    // Mongoose returns the original publication when updating it
                    return response.status(200).send({ publicationUpdated })
                })
            })
        }
        else
        {
            return helpers.removeFilesOfUploads(filePath, 'The extension is not valid', response)
        }
    }
    else
    {
        return response.status(500).send({message: 'There are no uploaded files'})
    }
}

function getImageFile(request, response)
{
    const imageFile = request.params.imageFile
    const pathFile = './uploads/publications/'  + imageFile

    fs.exists(pathFile, (exists) =>
    {
        if(exists)
        {
            //This is a express method
            response.sendFile(path.resolve(pathFile))
        } 
        else
        {
            response.status(200).send({ message: 'The image does not exists' })
        }
    })
}

module.exports = {
    publicationTest,
    savePublications,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}