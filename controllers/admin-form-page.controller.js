const jwt = require('jsonwebtoken');

const service = require('../services/forms.service');
const { models } = require('../sequelize-orm');
const { Op } = require("sequelize");
const fs = require('fs');
const config = require('../configs/config');
const errors = require('../configs/errors');
const templateUtil = require('../utils/template-util');

module.exports = {

    getForms: async (req, res) => {
        let page = req.body.current_page ? parseInt(req.body.current_page) : null;
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : null;
        let numberOfDisabledForms = await service.countForms({ status: 2 });
        let numberOfEnabledForms = await service.countForms({ status: 1 });
        let numberOfAllForms = await service.countForms();
        let statusCount = {
            all: numberOfAllForms,
            2: numberOfDisabledForms,
            1: numberOfEnabledForms
        };
        let forms = await service.getAllForms(req.body, page, perPage);
        res.status(200).json( {count: forms.count, data: forms.rows, statusCount} );
        return
    },
    getFormById: async (req, res) => {
        let result = await service.getFormById(req.params.id)
        res.status(200).json(result);
        return
    },
    updateFormById: async (req, res) => {
        let {title, status, emails} = req.body;
        if(!title || !status) {
            res.status(errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code).json({
                message: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.message,
                errCode: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code,
            });
            return;
        }
        if(emails) {
            let regexp = /[а-яА-ЯЁё]/
            if(regexp.test(emails)) {
                return res.status(errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code).json({
                    message: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.message,
                    errCode: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code,
                });
            }
            let emailsToCheck = emails.trim().split(",");
            for (let email of emailsToCheck) {
                if (!config.REGEX_EMAIL.test(email)) {
                    return res.status(errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code).json({
                        message: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.message,
                        errCode: errors.BAD_REQUEST_USER_EMAIL_NOT_VALID.code,
                    });
                }
            }
        }
        let result = await service.updateForm(req.params.id, {title: title, status: status, emails: emails});
        res.status(200).json(result);
        return
    },
    changeFormStatusById: async (req, res) => {
        let { id, status } = req.body;
        if(!id || !status) {
            res.status(errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code).json({
                message: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.message,
                errCode: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code,
            });
            return;
        }
        try {
            let form = await service.getFormById(id);
            if (!form) {
                res.status(errors.BAD_REQUEST_ID_NOT_FOUND.code).json({
                    message: errors.BAD_REQUEST_ID_NOT_FOUND.message,
                    errCode: errors.BAD_REQUEST_ID_NOT_FOUND.code,
                });
                return;
            }
            form = await service.updateForm(id, {status: status});
            return res.status(200).json(form);

        } catch (error) {
            res.status(400).json({
                message: error.message,
                errCode: ''
            });
            return
        }
    },
    getFormComments: async (req, res) => {
        let page = req.body.current_page ? parseInt(req.body.current_page) : null;
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : null;
        let comments = await service.getFormComments(req.body, page, perPage);
        res.status(200).json( {count: comments.count, data: comments.rows} );
        return
    },
    deleteFormCommentsByIds: async (req, res) => {
        let { ids } = req.body;
        try {
            let result = [];
            if (ids && ids.length) {
                for (let id of ids) {
                    let comment = await service.getFormCommentById(id);
                    if (!comment) {
                        result.push({ id: id, deleted: false, error: `Не знайдено запитання з id:${id}` })
                    } else {
                        await comment.destroy();
                        result.push({ id: id, deleted: true, error: false });
                    }
                }
            }
            return res.status(200).json(result);

        } catch (error) {
            res.status(400).json({
                message: error.message,
                errCode: ''
            });
            return
        }
    },
}
