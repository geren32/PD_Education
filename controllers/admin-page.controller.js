const sequelize = require('../sequelize-orm');
const { Op } = require("sequelize");
const path = require("path");
const fs = require('fs');
const { models } = require('../sequelize-orm');

const pagesService = require('../services/pages.service');
const config = require('../configs/config');
const {asyncResizeImage} = require('../utils/image-util');
const linksService = require('../services/links.service');
const errors = require('../configs/errors')



const a = config.A;
function transliterate(word) {
    return word.split('').map(function (char) {
        return a[char] || char;
    }).join("");
}

module.exports = {
    createPage: async (req, res) => {
        try {
            let { title, banner, sections, template, slag, body } = req.body;
            let status = config.GLOBAL_STATUSES.WAITING;
            if(banner) banner = JSON.stringify(banner);
            if(sections) sections = JSON.stringify(sections);
            if(body) body = JSON.stringify(body);
            if (!slag) {
                if (title) {
                    slag = transliterate(title);
                    let checkSlag =await linksService.getLinkBySlag({slag:slag});
                    // await models.links.findOne({where: {slag: slag}});
                    // let checkSlag = await pagesService.getPage({ slag: slag });
                    if (checkSlag) {
                        slag = slag + '-' + Date.now();
                    }
                } else {
                    slag = Date.now();
                }
            } else {
                let slagPage = await linksService.getLinkBySlag({slag:slag});
                // await models.links.findOne({where: {slag: slag}});
                // let slagPage = await pagesService.getPage({slag: slag});
                if(slagPage) throw new Error('Page with this name already exists');
            }
            let page = await pagesService.createPage({ type: 'marketing', title ,status, banner, sections, body, template, slag, created_user_id: req.userid, updated_user_id: req.userid});
            await linksService.createLinks({slag: slag, link: `/getPage/${slag}`, type: 'page'})
            // await models.links.create({slag: slag, link: `/getPage/${slag}`, type: 'page'});
            if(page.sections) page.sections = JSON.parse(page.sections);
            if(page.body) page.body = JSON.parse(page.body);
            if(page.banner) page.banner = JSON.parse(page.banner);
            return res.status(200).json(page);

        } catch (error) {
            res.status(400).json({
                message: error.message,
                errCode: '400'
            });
        }
    },
    updatePageById: async (req, res) => {
        let { id, title, banner, sections, template, status, slag, body } = req.body;
        try {
            let page = await pagesService.getPage({id: id});
            if (!page) {
             return   res.status(400).json({
                    message: `Failed to update page. Page with id: ${id} not exists.`,
                    errCode: '400'
                });

            }
            if (!slag) {
                if (title) {
                    slag = transliterate(title);
                    let checkSlag = await linksService.getLinkBySlag({slag:slag});
                    // await models.links.findOne({where: {slag: slag}});
                    // let checkSlag = await pagesService.getPage({ slag: slag });
                    if (checkSlag) {
                        slag = slag + '-' + page.id;
                    }
                } else {
                    slag = page.id;
                }
            } else {
                // let checkSlag = await pagesService.getPage({ slag: slag, id: id });
                let checkSlag =await linksService.getAllLinks({slag:slag});
                // await models.links.findAll({where: {slag: slag}});
                if((checkSlag && checkSlag.length>1) || (checkSlag && checkSlag.length && checkSlag[0].slag !== page.slag)) {
                    throw new Error('Page with this link already exists');
                }
                // let slagPages = await pagesService.getBlogPageAll({slag: slag});
                // if((slagPages && slagPages.length>1) || (slagPages && slagPages.length && slagPages[0].id !== id)) {
                //     throw new Error('Сторінка з таким посиланням уже існує');
                // }
            }
            if(body) body = JSON.stringify(body);
            if(banner) banner = JSON.stringify(banner);
            if(page.slag !== slag) {
                if(page.type === 'marketing') {
                    await linksService.updateLinks({slag: slag, link: `/getPage/${slag}`},{slag:post.slag})
                    // await models.links.update({slag: slag, link: `/getPage/${slag}`},{where: {slag: page.slag}})
                } else if(page.type === 'dealer') {
                    // await models.links.update({slag: slag, link: `/about-dealer/${slag}`},{where: {slag: page.slag}})
               await linksService.updateLinks({slag: slag, link: `/about-dealer/${slag}`},{slag:post.slag})
                }
            }
            page = await page.update({
                title,
                banner,
                sections: JSON.stringify(sections),
                template,
                status,
                slag,
                updated_user_id: req.userid,
                body,
                updatedAt:Math.floor(new Date().getTime() / 1000)
            })
            if(page.sections) page.sections = JSON.parse(page.sections);
            if(page.body) page.body = JSON.parse(page.body);
            if(page.banner) page.banner = JSON.parse(page.banner);
            return res.status(200).json(page);

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });

        }
    },
    getAllPages: async (req, res) => {
        let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : 10;
        try {
            let statusCount= await pagesService.countPagesByParam({status:req.body.status,type: 'marketing' })
            // let numberOfWaitionPages = await pagesService.countPagesByParam({ status: config.GLOBAL_STATUSES.WAITING, type: 'marketing' });
            // let numberOfActivePages = await pagesService.countPagesByParam({ status: config.GLOBAL_STATUSES.ACTIVE, type: 'marketing' });
            // let numberOfDeletedPages = await pagesService.countPagesByParam({ status: config.GLOBAL_STATUSES.DELETED, type: 'marketing' });
            // let numberOfAllPages = await pagesService.countPagesByParam({ status: { [Op.ne]: config.GLOBAL_STATUSES.DELETED }, type: 'marketing' });
            // let statusCount = {
            //     all: numberOfAllPages,
            //     0: numberOfDeletedPages,
            //     1: numberOfActivePages,
            //     3: numberOfWaitionPages,
            // };
            if (req.body && req.body.status && req.body.status === 'all') {
                let filter = await pagesService.makePageFilter(req.body, {
                    status: { [Op.ne]: 0 }, type: 'marketing'
                });
                let result = await pagesService.adminGetAllPages(filter, page, perPage);
                result.statusCount = statusCount;
                return res.status(200).json(result);
            }
            let filter = await pagesService.makePageFilter(req.body, {
                type: 'marketing'
            });
            let result = await pagesService.adminGetAllPages(filter, page, perPage);
            result.statusCount = statusCount;
            return res.status(200).json(result);

        } catch (error) {
         return   res.status(400).json({
                message: error.message,
                errCode: '400'
            });

        }
    },
    getPageById: async (req, res) => {
        let id = req.params.id;
        try {
            let page = await pagesService.getPage({id: id});
            if(!page) throw new Error(`Failed to update page. Page with id: ${id} not exists.`)
            if(page.sections) page.sections = JSON.parse(page.sections);
            if(page.body) page.body = JSON.parse(page.body);
            if(page.banner) page.banner = JSON.parse(page.banner);
            return res.status(200).json(page);

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });

        }
    },
    changePageStatusById: async (req, res) => {
        let { id, status } = req.body;
        try {
            let page = await pagesService.getPage({id: id});
            if (!page) {
             return   res.status(400).json({
                    message: `Failed to update page. Page with id: ${id} not exists.`,
                    errCode: '400'
                });

            }
            if (status == config.GLOBAL_STATUSES.DUPLICATE_POST) {
                let newSlag = page.slag + new Date().toLocaleString();
                let duplicatePage = await pagesService.createPage({
                    title: page.title,
                    sections: page.sections,
                    status: config.GLOBAL_STATUSES.WAITING,
                    slag: newSlag,
                    banner: page.banner,
                    body: page.body,
                    template: page.template,
                    type: page.type,
                    updated_user_id: req.userid,
                    created_user_id: req.userid
                });
                if(page.type === 'dealer'){
                    // await models.links.create({slag: newSlag, link: `/about-dealer/${newSlag}`, type: 'dealer-page'});
               await linksService.createLinks({slag: newSlag, link: `/about-dealer/${newSlag}`, type: 'dealer-page'})
                } else if(page.type === 'marketing') {
                    // await models.links.create({slag: newSlag, link: `/getPage/${newSlag}`, type: 'page'});
               await linksService.createLinks({slag: newSlag, link: `/getPage/${newSlag}`, type: 'page'})
                }
                return res.status(200).json(duplicatePage);
            }
            await page.update({ status: status ,updatedAt:Math.floor(new Date().getTime() / 1000)});
            return res.status(200).json(page);

        } catch (error) {
         return   res.status(400).json({
                message: error.message,
                errCode: '400'
            });

        }
    },
    deletePagesByIds: async (req, res) => {
        let { ids } = req.body;
        try {
            let result = [];
            if (ids && ids.length) {
                for (let id of ids) {
                    let page = await pagesService.getPage({id: id});
                    if (!page) {
                        result.push({ id: id, deleted: false, error: `Page not found with id:${id}` })
                    }
                    if (page && page.status == config.GLOBAL_STATUSES.DELETED) {
                        await page.destroy();
                        await linksService.deleteLinksBySlag({slag:page.slag})
                        // await models.links.destroy({where: {slag: page.slag}});
                        result.push({ id: id, deleted: true, error: false });
                    }
                    if (page && page.status != config.GLOBAL_STATUSES.DELETED) {
                        await page.update({ status: config.GLOBAL_STATUSES.DELETED });
                        result.push(page);
                    }
                }
            }

            return res.status(200).json(result);

        } catch (error) {
         return   res.status(400).json({
                message: error.message,
                errCode: '400'
            });

        }
    },

    /*uploadsFile: async (req, res) => {
        const file = req.file;
        let filename;
        try {
            let filePath = file ? file.path : 'no file attached';
            if(req.body.type && req.body.type == '7') {
                let newFilePath = {
                    image: await asyncResizeImage(filePath,1899, 560),
                    image_mobile: await asyncResizeImage(filePath, 1100, 560, true)
                }
                if(filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
                return res.status(200).json({filePath: newFilePath});
            } else {
                filename = path.basename(filePath);
                filePath = path.join('/', 'uploads', 'images', filename);
                return res.status(200).json(filePath);
            }
        } catch (error) {
            res.status(400).json(error.message);
            return
        }
    },*/

    createDealerPage: async (req, res) => {
        try {
            let { title, banner, sections, template, slag, body } = req.body;
            if(!body) {
                return res.status(errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code).json({
                    message: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.message,
                    errCode: errors.BAD_REQUEST_REQUIRED_USER_FIELDS_EMPTI.code,
                });
            }
            let status = config.GLOBAL_STATUSES.WAITING;
            if(banner) banner = JSON.stringify(banner);
            if(sections) sections = JSON.stringify(sections);
            if(body) body = JSON.stringify(body);
            if (!slag) {
                if (title) {
                    slag = transliterate(title);
                    let checkSlag = await linksService.getLinkBySlag({slag:slag});
                    // await models.links.findOne({where: {slag: slag}});
                    // let checkSlag = await pagesService.getPage({ slag: slag });
                    if (checkSlag) {
                        slag = slag + '-' + Date.now();
                    }
                } else {
                    slag = Date.now();
                }
            } else {
                let slagPage = await linksService.getLinkBySlag({slag:slag});
                // await models.links.findOne({where: {slag: slag}});
                // let slagPage = await pagesService.getPage({slag: slag});
                if(slagPage) throw new Error('Page with this link already exists');
            }
            let page = await pagesService.createPage({ type: 'dealer', title ,status, banner, sections, body, template, slag, created_user_id: req.userid, updated_user_id: req.userid});
            await linksService.createLinks({slag: slag, link: `/about-dealer/${slag}`, type: 'dealer-page'});
            // await models.links.create({slag: slag, link: `/about-dealer/${slag}`, type: 'dealer-page'});
            if(page.sections) page.sections = JSON.parse(page.sections);
            if(page.body) page.body = JSON.parse(page.body);
            if(page.banner) page.banner = JSON.parse(page.banner);
            return res.status(200).json(page);

        } catch (error) {
           return res.status(400).json({
                message: error.message,
                errCode: '400'
            });
        }
    },
    getAllDealersPages: async (req, res) => {
        let page = req.body.current_page ? parseInt(req.body.current_page) : 1;
        let perPage = req.body.items_per_page ? parseInt(req.body.items_per_page) : 10;
        try {
            let statusCount= await pagesService.countPagesByParam({status:req.body.status,type: 'dealer' })
            // let numberOfWaitionPages = await pagesService.countPagesByParam({ status: config.GLOBAL_STATUSES.WAITING, type: 'dealer' });
            // let numberOfActivePages = await pagesService.countPagesByParam({ status: config.GLOBAL_STATUSES.ACTIVE, type: 'dealer' });
            // let numberOfDeletedPages = await pagesService.countPagesByParam({ status: config.GLOBAL_STATUSES.DELETED, type: 'dealer' });
            // let numberOfAllPages = await pagesService.countPagesByParam({ status: { [Op.ne]: config.GLOBAL_STATUSES.DELETED }, type: 'dealer' });
            // let statusCount = {
            //     all: numberOfAllPages,
            //     0: numberOfDeletedPages,
            //     1: numberOfActivePages,
            //     3: numberOfWaitionPages,
            // };
            if (req.body && req.body.status && req.body.status === 'all') {
                let filter = await pagesService.makePageFilter(req.body, {
                    status: { [Op.ne]: 0 }, type: 'dealer'
                });
                let result = await pagesService.adminGetAllPages(filter, page, perPage);
                result.statusCount = statusCount;
                return res.status(200).json(result);
            }
            let filter = await pagesService.makePageFilter(req.body, {
                type: 'dealer'
            });
            let result = await pagesService.adminGetAllPages(filter, page, perPage);
            result.statusCount = statusCount;
            return res.status(200).json(result);

        } catch (error) {
          return  res.status(400).json({
                message: error.message,
                errCode: '400'
            });

        }
    },
}
