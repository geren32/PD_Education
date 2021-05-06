const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");
const config = require('../configs/config');
const extraUtil = require('../utils/extra-util');



async function getNews (params, withInclude, trans) {
    let filter = params;
    if (typeof params !== 'object') {
        filter = { id: params }
    }

    let transaction = trans ? trans : null;
    const include = withInclude ? {
        include:[
                {model: models.uploaded_images, as: "image"},
                {model: models.uploaded_images, as: "banner_image"},
                {model: models.uploaded_images, as: "banner_image_mobile"},
                { model: models.posts_body, as: "body",
                    include: [
                        { model: models.uploaded_images, as: "gallery_content" , through:{attributes:[]} }
                    ] },
            ]} : {};

    let result = await models.posts.findOne( { where: filter, ...include, transaction});
    if(withInclude) result = extraUtil.outputFormatGalleryContentForPosts(result);

    return result;
}



module.exports = {

    createPost: async (post, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();

            let result = await models.posts.create(post, {
                include:[
                    {
                        model: models.posts_body, as: "body", include:[
                            {model: models.posts_body_to_uploaded_images, as: "posts_body_images" }
                        ]
                    }],
                transaction
            });

            await models.post_to_category.create({post_id: result.id, category_id: 1}, {transaction});

            result = await getNews(result.id, true, transaction);

            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },

    updatePost: async ( postId, postData, bodyData, trans) => {
        postData.updatedAt = Math.floor(new Date().getTime() / 1000);
        let transaction = null;
        let result = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();

            let postBodyIds = await models.posts_body.findAll({where: {post_id: postId}, attributes:['id'], transaction });
            postBodyIds = postBodyIds.map(i => {return i.id});
            //delete old posts_body and posts_body_to_uploaded_images
            await models.posts_body.destroy({where: {id: {[Op.in]: postBodyIds} }, transaction});
            await models.posts_body_to_uploaded_images.destroy({where: {posts_body_id: {[Op.in]: postBodyIds} }, transaction});
            //create new posts_body and posts_body_to_uploaded_images
            await models.posts.update(postData,{where: {id: postId}, transaction});
            await models.posts_body.bulkCreate(bodyData, { include:[ {model: models.posts_body_to_uploaded_images, as: "posts_body_images" } ], transaction });

            result = await getNews(postId, true, transaction);

            if (!trans) await transaction.commit();
            return result;
        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },

    getMetaDataBySlagOrUrl: async (url, trans) => {
        const transaction = trans ? trans : null;
        try{
            let metaData = await models.meta_data.findOne({where: {url: url}, transaction});
            if (!metaData) {
                let slag = url.charAt(0) === '/' ? url.slice(1) : url;
                let isItSlag = await models.links.findOne({where: {slag: slag}, transaction});

                if (isItSlag && isItSlag.link) {
                    metaData = await models.meta_data.findOne({where: {url: isItSlag.link}, transaction});
                }
            }
            return metaData;
        } catch (err) {
        if (transaction) await transaction.rollback();
        err.code = 400;
        throw err;
    }
    },

    countPostByParam: async (whereObj) => {
        let result = await models.posts.count({
            where: whereObj
        });
        if(result==0){
             result= config.GLOBAL_STATUSES.DELETED
        } 
        if(result==1){
            result=config.GLOBAL_STATUSES.ACTIVE;
        }
        if(result==3){                        
            result=config.GLOBAL_STATUSES.WAITING
        }
      if(result==="all"){
    result={ [Op.ne]: config.GLOBAL_STATUSES.DELETED }
}
        return result ? result : 0;
    },

    /*getNews: async (params, attributes) => {
        let filter = params;
        if (typeof params !== 'object') {
            filter = { id: params }
        }
        const result = await models.posts.findOne({
            where: filter,
            attributes: attributes
        });

        return result;
    },*/

    getNews: getNews,

    adminGetAllNews: async (filter, page, perPage, attributes) => {
        try {
            const offset = perPage * (page - 1);
            const limit = perPage;
            let result = await models.posts.findAndCountAll({
                where: filter.where,
                offset: offset,
                limit: limit,
                order: filter.sort,
                attributes: attributes,
                distinct: true,
                include:[
                    {model: models.uploaded_images, as: "image"},
                    {model: models.uploaded_images, as: "banner_image"},
                    {model: models.uploaded_images, as: "banner_image_mobile"},
                    { model: models.posts_body, as: "body", include: [
                            { model: models.uploaded_images, as: "gallery_content" , through:{attributes:[]} }
                        ]},
                ]
            });
            return result.count > 0 && result.rows.length ? {
                data: result.rows,
                count: result.count
            } : { data: [], count: 0 };

        } catch (err) {
            err.code = 400;
            throw err;
        }
    },


    makePostFilter: async (body, whereObj) => {
        let arr = [];
        let sort;

        if (body.search) {
            let searchField = body.search.trim().split(" ");
            if (searchField && searchField.length) {
                let like = [];
                searchField.forEach((item) => {
                    like.push({ [Op.like]: `%${item}%` });
                });
                arr.push({ title: { [Op.or]: like } });
            }
        }
        if (body.status && body.status != 'all') {
            arr.push({ status: body.status });
        }
        if (body.dateFrom || body.dateTo) {
            let date = {};
            if (body.dateFrom) date[Op.gte] = body.dateFrom;
            if (body.dateTo) date[Op.lte] = body.dateTo;

            arr.push({ createdAt: date });
        }
        if (body.sort) {
            if (body.sort.created_at) {
                sort = [['createdAt', body.sort.created_at]];
            }
        } else {
            sort = [['createdAt', 'DESC']];
        }

        let filter = { sort, where: { [Op.and]: [whereObj, ...arr] } };
        return filter;
    },

    deletePostToCategory: async (postId, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : null;
            return await models.post_to_category.destroy({ where: {post_id: postId}, transaction });

        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },

    deletePostBodyAndPostsImages: async (postId, trans) => {
        let transaction = null;
        try {
            transaction = trans ? trans : await sequelize.transaction();

            let postBodyIds = await models.posts_body.findAll({where: {post_id: postId}, attributes:['id'], transaction });
            postBodyIds = postBodyIds.map(i => {return i.id});
            //delete posts_body and posts_body_to_uploaded_images
            await models.posts_body.destroy({where: {id: {[Op.in]: postBodyIds} }, transaction});
            await models.posts_body_to_uploaded_images.destroy({where: {posts_body_id: {[Op.in]: postBodyIds} }, transaction});
            return true;
        } catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }
    },

updatePostById: async (post,id,trans)=>{
    let transaction = null;
    try {
        transaction = trans ? trans : await sequelize.transaction();
       await models.posts.update(post,{where: id},trans);
       let result = await models.posts.findOne({
           where:id
       })
       if (!trans) await transaction.commit();
    return result;
    }

catch (err) {
            if (transaction) await transaction.rollback();
            err.code = 400;
            throw err;
        }

}
    // updateBlogPostById: async (id, post, category_id) =>  {
    //     try {
    //         let result = await models.posts.update(post, {
    //             where: {
    //                 id: id
    //             }
    //           });
    //         await category_id.forEach(function (i) {
    //             models.post_to_category.create({post_id: id, category_id: i});
    //         })
    //         result = await models.posts.findOne({
    //             where: {
    //                 id: id
    //             }
    //           })
    //         return result;
    //     } catch (err) {
    //         err.code = 400;
    //         throw err;
    //     }
    // },

}
