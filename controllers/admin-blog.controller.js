const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");
const path = require("path");

const postService = require('../services/post.service');
const config = require('../configs/config');
const errors = require('../configs/errors');
const { models } = require('../sequelize-orm');
const {slugify} = require('transliteration');
slugify.config({ lowercase: true, separator: '-' });
const extraUtil = require('../utils/extra-util');
const linksService =require('../services/links.service');

module.exports = {
    createNews: async (req, res) => {
        let { title, image, body, slag, status, subtitle, banner_image, banner_image_mobile, banner_video, meta_data} = req.body;
        status = status ? status : config.GLOBAL_STATUSES.WAITING;
        try {
            if (!slag) {
                if (title) {
                    // transliterate
                    slag = slugify(title);
                    // await models.links.findOne({where: {slag: slag}});
                    let checkSlag =  await linksService.getLinkBySlag({slag:slag});
                     
                    // let checkSlag = await postService.getNews({ slag });
                    if (checkSlag) {
                        slag = slag + '-' + Date.now();
                    }
                } else {
                    slag = Date.now();
                }
            } else {
                let checkSlag = await postService.getNews({ slag }, false, null);
                if (checkSlag) {
                    slag = slag + '-' + Date.now();
                }
            }

            let postData = {
                title,
                subtitle,
                image_id : image && image.id ? image.id : null,
                banner_image_id : banner_image && banner_image.id ? banner_image.id : null,
                banner_image_mobile_id : banner_image_mobile && banner_image_mobile.id ? banner_image_mobile.id : null,
                banner_video_id : banner_video && banner_video.id ? banner_video.id : null,
                status,
                slag,
                created_user_id: req.userid
            };
            postData.body = extraUtil.inputFormatGalleryContentForPosts(body);

            let metaData;
            if (meta_data && ( meta_data.meta_title || meta_data.meta_desc || meta_data.meta_keys)){
                metaData = {
                    url: `/getPost/${slag}`,
                    meta_title: meta_data.meta_title,
                    meta_desc: meta_data.meta_desc,
                    meta_keys: meta_data.meta_keys,
                }
            }

            const transaction = await sequelize.transaction();
            let post = await postService.createPost(postData, transaction);
           let link=  await linksService.createLinks({slag: slag, link: `/getPost/${slag}`, type: 'post'},transaction)
            // await models.links.create({slag: slag, link: `/getPost/${slag}`, type: 'post'}, {transaction});
 
           
            if(metaData) post.meta_data = await models.meta_data.create(metaData, {transaction});
            await transaction.commit();
        
         
            return res.status(200).json(post);

        } catch (error) {
        return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },

    updateNewsById: async (req, res) => {
        let { id, title, subtitle, image, banner_image, banner_image_mobile, banner_video,  body, slag, status, meta_data } = req.body;
        try {
            let post = await postService.getNews(id, false, null);
           
            if (!post) {
               return res.status(400).json({
                    message: errors.BAD_REQUEST_ID_NOT_FOUND.message,
                    errCode: errors.BAD_REQUEST_ID_NOT_FOUND.code
                });
               
            }
            
            if (!slag) {
                if (title) {
                    // transliterate
                    slag = slugify(title);
                    let checkSlag = await linksService.getLinkBySlag({slag:slag})
            //   await models.links.findOne({where: {slag: slag}});
                    if (checkSlag) {
                        slag = slag + '-' + Date.now();
                    }
                } else {
                    slag = Date.now();
                }
            } else {
               
               
                let checkSlag =  await linksService.getAllLinks({slag:slag});
              
              
               
                if((checkSlag && checkSlag.length>1) || (checkSlag && checkSlag.length && checkSlag[0].slag !== post.slag)) {
                    throw new Error('News with this link already exists');
                }
                // let checkSlag = await postService.getNews({ slag });
                // if (checkSlag) {
                //     slag = slag + '-' + post.id;
                // }
            }
            const transaction = await sequelize.transaction();
            let metaData = {};
            if (meta_data && ( meta_data.meta_title || meta_data.meta_desc || meta_data.meta_keys)) {
                metaData = {
                    meta_title: meta_data.meta_title,
                    meta_desc: meta_data.meta_desc,
                    meta_keys: meta_data.meta_keys,
                }
            }
            if(post.slag !== slag) {
                // await models.links.update({slag: slag, link: `/getPost/${slag}`},{where: {slag: post.slag}, transaction});
                await linksService.updateLinks({slag: slag, link: `/getPost/${slag}`},{slag:post.slag});
                metaData.url = `/getPost/${slag}`;
            }

            let a = await models.meta_data.update(metaData,{where: {url: `/getPost/${post.slag}`}, transaction});

            const bodyData = extraUtil.inputFormatGalleryContentForPosts(body, id);
            const postData = {
                title,
                subtitle,
                image_id : image && image.id ? image.id : null,
                banner_image_id : banner_image && banner_image.id ? banner_image.id : null,
                banner_image_mobile_id : banner_image_mobile && banner_image_mobile.id ? banner_image_mobile.id : null,
                banner_video_id : banner_video && banner_video.id ? banner_video.id : null,
                slag,
                status,
                updated_user_id: req.userid
            };
            post = await postService.updatePost(id, postData, bodyData, transaction );
            post.meta_data = await postService.getMetaDataBySlagOrUrl(post.slag, transaction);

            await transaction.commit();

            return res.status(200).json(post);

        } catch (error) {
           return res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },

    getAllNews: async (req, res) => {
        let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : 10;
        try {
      let statusCount = await postService.countPostByParam({status: req.body.status});
           
            //Замінив на функцію вище   
            // let numberOfWaitionNews = await postService.countPostByParam({ status: config.GLOBAL_STATUSES.WAITING });
            // let numberOfActiveNews = await postService.countPostByParam({ status: config.GLOBAL_STATUSES.ACTIVE });
            // let numberOfDeletedNews = await postService.countPostByParam({ status: config.GLOBAL_STATUSES.DELETED });
            // let numberOfAllNews = await postService.countPostByParam({ status: { [Op.ne]: config.GLOBAL_STATUSES.DELETED } });
            // let statusCount = {
            //     all: numberOfAllNews,
            //     0: numberOfDeletedNews,
            //     1: numberOfActiveNews,
            //     3: numberOfWaitionNews,
            // };

            let filter;
            let result;
            if (req.body && req.body.status && req.body.status === 'all') {
                filter = await postService.makePostFilter(req.body, {
                    status: { [Op.ne]: 0 }
                });
                result = await postService.adminGetAllNews(filter, page, perPage, false);
            } else {
                filter = await postService.makePostFilter(req.body);
                result = await postService.adminGetAllNews(filter, page, perPage, false);
            }

            if(result.data && result.data.length){
                for(let i=0; i<result.data.length; i++){
                    result.data[i] = extraUtil.outputFormatGalleryContentForPosts(result.data[i]);
                }
            }
            result.statusCount = statusCount;
            return res.status(200).json(result);

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },

    getNewsById: async (req, res) => {
        let id = req.params.id;
        try {
            let post = await postService.getNews(id, true, null);
            return res.status(200).json(post);

        } catch (error) {
          return res.status(400).json({
                message: error.message,
                errCode:'400'
            });
            
        }
    },

    changeNewsStatusById: async (req, res) => {
        let { id, status } = req.body;
        try {
            let result;
            const include = (status == config.GLOBAL_STATUSES.DUPLICATE_POST);
            let post = await postService.getNews(id, include, null);
            if (!post) {
              return  res.status(400).json({
                    message: `Failed to update news. News with id: ${id} not exists.`,
                    errCode: '400'
                });
               
            }
            if (status == config.GLOBAL_STATUSES.DUPLICATE_POST) {

                if (!post.slag) {
                    if (post.title) {
                        // transliterate
                        post.slag = slugify(post.title);
                        let checkSlag = await postService.getNews({ slag: post.slag }, false, null);
                        if (checkSlag) {
                            post.slag = post.slag + '-' + Date.now();
                        }
                    } else {
                        post.slag = Date.now();
                    }
                } else {
                    post.slag = post.slag + '-' + Date.now();
                }

                const transaction = await sequelize.transaction();
                //Duplicate post
                const postData = {
                    title: post.title,
                    subtitle: post.subtitle,
                    body: extraUtil.inputFormatGalleryContentForPosts(post.body),
                    status: config.GLOBAL_STATUSES.WAITING,
                    slag: post.slag,
                    image_id: post.image_id,
                    banner_image_id : post.banner_image_id,
                    banner_image_mobile_id : post.banner_image_mobile_id,
                    banner_video_id : post.banner_video_id,
                    created_user_id: req.userid
                };

                result = await postService.createPost(postData, transaction);
               await linksService.createLinks({slag: post.slag, link: `/getPost/${post.slag}`, type: 'post'})
                // await models.links.create({slag: post.slag, link: `/getPost/${post.slag}`, type: 'post'}, {transaction});
                await transaction.commit();

            } else {
                await post.update({ status: status, updated_user_id: req.userid ,updatedAt:Math.floor(new Date().getTime() / 1000)});
                await postService.updatePostById({ status: status, updated_user_id: req.userid ,updatedAt:Math.floor(new Date().getTime() / 1000)},{id:id})
                result = post;
            }

            return res.status(200).json(result);

        } catch (error) {
           return res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },

    deleteNewsByIds: async (req, res) => {
        let { ids } = req.body;
        try {
       
            let result = [];
            if (ids && ids.length) {
                const transaction = await sequelize.transaction();
                  
                    for (let id of ids) {
                    let post = await postService.getNews(id, false, null);
                    if (!post) {
                        result.push({ id: id, deleted: false, error: `No found news with id:${id}` })
                    }
                    if (post && post.status == config.GLOBAL_STATUSES.DELETED) {
                    
                        await postService.deletePostToCategory(post.id, transaction);
                   
                        await postService.deletePostBodyAndPostsImages(post.id, transaction);
                        await post.destroy({transaction});
                        
                        await linksService.deleteLinksBySlag({ slag: post.slag},transaction)
                      

                        result.push({ id: id, deleted: true, error: false });
                    } else {
                        
                        await postService.updatePostById({
                                status: config.GLOBAL_STATUSES.DELETED,
                                updated_user_id: req.userid,
                                updatedAt:Math.floor(new Date().getTime() / 1000)},{id:ids})
                        result.push(post);
                    }
                }
                await transaction.commit();
            }
            return res.status(200).json(result);

        } catch (error) {
         return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },


    /*uploadsFile: async (req, res) => {
        const file = req.file;
        try {
            let filePath = file ? file.path : 'no file attached';
            const filename = path.basename(filePath);
            filePath = path.join('/', 'uploads', 'images', filename);
            return res.status(200).json(filePath);
        } catch (error) {
            res.status(400).json(error.message);
            return
        }
    },*/



}
