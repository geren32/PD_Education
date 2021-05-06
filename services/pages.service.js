const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");
const config = require('../configs/config');



module.exports = {


    createPage: async (page) => {
     let result = await models.pages.create(page)
        return result.toJSON()
    },

    countPagesByParam: async (filter) => {
        let result = await models.pages.findAndCountAll({
            where: filter
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
        return result.count ? result.count : 0;
    },
    adminGetAllPages: async (filter, page, perPage) => {
        try {
            const offset = perPage * (page - 1);
            let result = await models.pages.findAndCountAll({
                where: filter.where,
                offset: offset,
                limit: perPage,
                order: filter.sort,
            });

// result= result.map(function(item) {
//     return item.t();
// })
            return result.count > 0 && result.rows.length ? {
                data: result.rows,
                count: result.count
            } : { data: [], count: 0 };

        } catch (err) {
            err.code = 400;
            throw err;
        }
    },


    makePageFilter: async (body, whereObj) => {
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

     getPage :async(filter)=> {
        try {
            return await models.pages.findOne({where: filter})
            // let result = await models.pages.findOne({
            //     where: {id: id}
            // })
            //
            // result = JSON.parse(JSON.stringify(result));
            // return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getBlogPageBySlag: async (slag)  =>{
        try {
            let result = await models.pages.findOne({
                where: {slag: slag, status: 1}
            })

            return  result.toJSON();
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

    async createBlogPage(data) {
        let result = await models.pages.create(data);

        return  result.map(function(item) {
            return item.toJSON();
        })
    },
    async updateBlogPage(data, id) {
        let result = await models.pages.update(data, {where: {id: id}});
        result = await models.pages.findOne({
            where: {id: id}
        })

        return  result.map(function(item) {
            return item.toJSON();
        });
    },
    async getBlogPageAll(filter) {
        try {
            let result = await models.pages.findAll({
                where: filter
            });

            return  result.map(function(item) {
                return item.toJSON();
            })
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    async getBlogPages(filter, perPage, page) {
        try {
            const offset = perPage * (page - 1);
            const limit = perPage;

            let result = await models.pages.findAndCountAll({
                where: filter.where,
                offset: offset,
                limit: limit,
                order: filter.sort

            });
         result=   result.map(function(item) {
                return item.toJSON();
            })

            return result.count > 0 && result.rows.length ? {
                pages: result.rows,
                count: result.count
            } : {pages: [], count: 0};
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    async deleteBlogPage(id, transaction) {
        try {
            let result = await models.pages.destroy({
                where: {id: id},
                transaction
            })

            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }

    },
    // makePageFilter: async function (body, whereObj) {
    //     let arr = [];
    //     let sort;
    //     if (body.search) {
    //         if (body.search.name) {
    //             let searchField = body.search.name.trim().split(" ");
    //             if (searchField && searchField.length) {
    //                 let like = [];
    //                 searchField.forEach((item) => {
    //                     like.push({[Op.like]: `%${item}%`});
    //                 });
    //                 arr.push({title: {[Op.or]: like}});
    //             }
    //         }
    //     }
    //
    //     if (body.filter) {
    //         if (body.filter.types && body.filter.types.length) {
    //             let types = [];
    //             body.filter.types.forEach((item) => {
    //                 types.push({type: item});
    //             });
    //             arr.push({[Op.or]: types});
    //         }
    //         if (body.filter.status && body.filter.status.length) {
    //             let statuses = [];
    //             body.filter.status.forEach((item) => {
    //                 statuses.push({status: item});
    //             });
    //             arr.push({[Op.or]: statuses});
    //         }
    //     }
    //     if (body.sort) {
    //         if (body.sort.createdAt) {
    //             sort = [['createdAt', body.sort.createdAt]];
    //         }
    //     } else {
    //         sort = [['createdAt', 'DESC']];
    //     }
    //
    //     let filter = {sort, where: {[Op.and]: [whereObj, ...arr]}};
    //
    //     return filter;
    // }
}
