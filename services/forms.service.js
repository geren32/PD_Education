const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");



module.exports = {
    createFormComment: async (comment) => {
        try {
            let result = await models.form_comments.create(comment);
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getFormComments: async (settings, page, perPage) => {
        try {
            let where = [];
            let offset = 0
            if (settings.search) {
                let searchField = settings.search.trim().split(" ");
                if (searchField && searchField.length) {
                    let like = [];
                    searchField.forEach((item) => {
                        like.push({ [Op.like]: `%${item}%` });
                    });
                    where.push({
                        [Op.or]: [
                            {name: { [Op.or]: like }},
                        ]
                    });
                }
            }
            if (settings.dateFrom || settings.dateTo) {
                let created_at = {};
                if (settings.dateFrom) created_at[Op.gte] = new Date(settings.dateFrom).getTime()/1000;
                // if (settings.dateTo) created_at[Op.lte] = new Date(settings.dateTo).getTime()/1000;
                if (settings.dateTo) {
                    if (settings.dateFrom == settings.dateFrom) {
                        created_at[Op.lte] = (new Date(settings.dateTo).getTime()/1000) + 86400;
                    } else {
                        created_at[Op.lte] = new Date(settings.dateTo).getTime()/1000;
                    }
                }
                where.push({ created_at: created_at });
            }
            if (settings.form_id) {
                where.push({ [Op.or]: [{form_id: settings.form_id}] });
            }
            if (page && perPage) {
                offset = perPage * (page - 1);
            }
            let result = await models.form_comments.findAndCountAll({where: where, offset: offset, limit: perPage})
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getFormCommentById: async (id) =>  {
        try {
            let result = await models.form_comments.findOne({
                where: {id: id}
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    deleteFormComment: async (id) => {
        try {
            let result = await models.form_comments.destroy({
                where: {id: id}
            })
            return result;
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    updateForm: async (id, data) => {
        try {
            await models.forms.update(data, {where: {id}})
            let result = await models.forms.findOne({
                where: {id: id}
            })
            return result
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getFormById: async (id) =>  {
        try {
            return await models.forms.findOne({where: {id: id}});
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    countForms: async (whereObj) =>  {
        try {
            return await models.forms.count({where: whereObj});
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },
    getAllForms: async (settings, page, perPage) =>  {
        try {
            let where = [];
            let offset = 0
            if (settings.search) {
                let searchField = settings.search.trim().split(" ");
                if (searchField && searchField.length) {
                    let like = [];
                    searchField.forEach((item) => {
                        like.push({ [Op.like]: `%${item}%` });
                    });
                    where.push({
                        [Op.or]: [
                            {title: { [Op.or]: like }},
                        ]
                    });
                }
            }
            if (settings.status && settings.status !== 'all') {
                where.push({ status: settings.status});
            }
            if (page && perPage) {
                offset = perPage * (page - 1);
            }
            return await models.forms.findAndCountAll({where: where, offset: offset, limit: perPage});
        } catch (err) {
            err.code = 400;
            throw err;
        }
    },

}
