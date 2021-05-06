const { models } = require('../sequelize-orm');

class SlagController {

    async getAllMenu(slag){
        try {
            if (!slag) throw new Error('No slag');

            let data = await models.menu.findOne({
                where: {
                    slag: slag
                }
            });
   
            if(data) 
            //console.log("+"+data);
          //  data = JSON.parse(JSON.stringify(data));
            return data.toJSON();

        }catch (e) {
            throw e
        }
    }

}

module.exports = SlagController;