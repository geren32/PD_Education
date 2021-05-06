const jwt = require('jsonwebtoken');

const service = require('../services/forms.service');
const { models } = require('../sequelize-orm');
const { Op } = require("sequelize");
const fs = require('fs');
const config = require('../configs/config');
const templateUtil = require('../utils/template-util');
const emailUtil = require('../utils/mail-util');

module.exports = {

    createNewComment: async (req, res) => {
        let {message, phone, email, name, form_id} = req.body;
        let form = await service.getFormById(form_id);
        if(form) {
            let result = await service.createFormComment({message, phone, email, name, form_id, created_at: Math.floor(new Date().getTime() / 1000)});
            if(result) {
                if(form.emails) {
                    let adminEmails = form.emails.trim().split(",");
                    for (let adminEmail of adminEmails) {
                        let mailObj = {
                            to: adminEmail,
                            subject: 'У вас нове повідомлення',
                            data: {
                                info: {message, phone, email, name}
                            }
                        };
                        await emailUtil.sendMail(mailObj, 'form-question-to-admin');
                    }
                    let clientMailObj = {
                        to: email,
                        subject: 'Ваше питання було надіслано',
                        data: {
                            name: name,
                            message: message
                        }
                    };
                    await emailUtil.sendMail(clientMailObj, 'form-question-to-client');
                }
            }
            return res.json(true)
        } else throw new Error('Помилка')
    }
}
