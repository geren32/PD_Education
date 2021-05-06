const { models } = require('../sequelize-orm');
const pageService= require('../services/pages.service'); 
class PagesController {

    async getPages(id){
        try {
            if (!id) throw new Error('No id');

            let data = pageService.getPage({id:id});
            //Замінив на те що зверху
            // await models.pages.findOne({
            //     where: {
            //         id: id
            //     }
            // });
           
            if(data) 
           // data = JSON.parse(JSON.stringify(data));
            return data.toJSON();

        }catch (e) {
            throw e
        }
    }

}

module.exports = PagesController;