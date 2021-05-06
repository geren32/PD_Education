const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");
const path = require("path");
const fs = require('fs');
const { models } = require('../sequelize-orm');

const pagesService = require('../services/pages.service');
const config = require('../configs/config');
const {asyncResizeImage} = require('../utils/image-util');


module.exports = {

    uploadImage: async (req, res) => {
        const file = req.file;
        const filePath = file.path;
        const width = req.query.width ? parseInt(req.query.width) : null;
        const height = req.query.height ? parseInt(req.query.height) : null;
        const type = req.query.type ? req.query.type : null;
        const fit = req.query.fit ? req.query.fit : 'cover';
        try {

            let img = await asyncResizeImage(filePath, width, height, fit);

            const dataImage = {
                type: type,
                filename: file.filename,
                width: img.width,
                height: img.height,
                size: img.size
            };
            const result = await models.uploaded_images.create(dataImage);

            return res.status(200).json(result);
        } catch (error) {
            fs.unlinkSync(filePath);
          return  res.status(400).json(error.message);
            
        }
    },

    updateImage: async (req, res) => {
        const id = req.body.id ? req.body.id : null;
        const alt_text = req.body.alt_text ? req.body.alt_text : null;
        const description = req.body.description ? req.body.description : null;
        try {
            const dataImage = {
                alt_text: alt_text,
                description: description
            };
            await models.uploaded_images.update(dataImage,{where: {id: id}});
            const result = await models.uploaded_images.findOne({where: {id: id}});

            return res.status(200).json(result);
        } catch (error) {
          return  res.status(400).json(error.message);
            
        }
    },

    deleteImage: async (req, res) => {
        const id = req.params.id;
        try {
            let filePath;
            const img = await models.uploaded_images.findByPk(id);
            if(img && img.filename){
                filePath = './public/uploads/' + (img.type ? img.type + '/' : '' ) + img.filename
            }else{
                throw new Error('File not exist');
            }
            const result = await models.uploaded_images.destroy({where: {id: id}});
            fs.unlinkSync(filePath);

            return res.status(200).json(result);
        } catch (error) {
          return  res.status(400).json(error.message);
            
        }
    },

    getImages: async (req, res) => {
        const ids = req.body.id;
        try {
            let images;
            if(ids && Array.isArray(ids) && ids.length){
                images = await models.uploaded_images.findAll({where: { id: {[Op.in]:ids } }});
            }else{
                throw new Error('Id not provided');
            }
            return res.status(200).json(images);
        } catch (error) {
           return res.status(400).json(error.message);
            
        }
    },

}
