const { models, model } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');



const userAttributes = [
    'last_name',
    'first_name',
    'email',
    'phone',
];





module.exports = {

    getAllSabic: async (filter) => {

        if (!filter) filter = null;


        let overview = await models.salon.findOne({
            where: { id: filter }, include: [
                { model: models.users, attributes: userAttributes },
           {model: models.sales_persons, attributes:['address']} ]
        })


        let result = await models.sales_persons.findAll({
            where: {id:overview.sales_id},
            include: [{ model: models.users, attributes: userAttributes }]
        });
 

        return result.map(function (item) {
            return item.toJSON();
        });


    }




}