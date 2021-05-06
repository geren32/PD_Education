const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const fs = require('fs')

async function  updateOrCreate   (model, where, newItem)  {
    // First try to find the record
    let foundItem = await model.findOne({where});
    if (!foundItem) {
        // Item not found, create a new one
         foundItem = await model.create(newItem)
    }
    else
    {
          await model.update(newItem, {where});
         foundItem = await model.findOne({where});
    }

    //  let  result = await JSON.parse(JSON.stringify(foundItem));
    let result = foundItem.map(function(item) {
        return item.toJSON();
    })
    return result;
}
module.exports = {
    updateOrCreate:updateOrCreate,


addProduct: async (product) => {
        let productJ = {
            name: product.Nomenclature,
            sku: product.GROUP_ID
        }

    try {
        let result = await models.product.create(productJ);

        return result;
    } catch (err) {
        err.code = 400;
        throw err;
    }
},
createAttribute: async (i) => {

   let result = await models.product_variations.findOne({where: {sku: i.GROUP_ID[0]}})

        if(i.Technology[0]) {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id: 1,

                product_variation_id: result.id
            },{
                attribute_id: 1,
                value: i.Technology[0],
                product_variation_id: result.id
            })

        }
        if(i.Color[0]) {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id: 2,

                product_variation_id: result.id
            },{
                attribute_id: 2,
                value: i.Color[0],
                product_variation_id: result.id
            })

        }

        if(i.Design[0])
        {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:3 ,

                product_variation_id:result.id
            },{
                attribute_id:3 ,
                value: i.Design[0],
                product_variation_id:result.id
            })

        }
        if(i.DrawerExtension[0])
        {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:4 ,

                product_variation_id:result.id
            },{
                attribute_id:4 ,
                value: i.DrawerExtension[0],
                product_variation_id:result.id
            })

        }
        if(i.DrawerHeight[0])
        {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:5 ,

                product_variation_id:result.id
            },{
                attribute_id:5 ,
                value: i.DrawerHeight[0],
                product_variation_id:result.id
            })

        }
        if(i.Facade[0])
        {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:6 ,

                product_variation_id:result.id
            },{
                attribute_id:6 ,
                value: i.Facade[0],
                product_variation_id:result.id
            })

        }
        if(i.Length[0])
        {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:7 ,

                product_variation_id:result.id
            },{
                attribute_id:7 ,
                value: i.Length[0],
                product_variation_id:result.id
            })

        }
      if(i.Lever[0])
        {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:8 ,

                product_variation_id:result.id
            },{
                attribute_id:8 ,
                value: i.Lever[0],
                product_variation_id:result.id
            })

        }
      if(i.Load[0])
        {

            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:9 ,

                product_variation_id:result.id
            },{
                attribute_id:9 ,
                value: i.Load[0],
                product_variation_id:result.id
            })
        }
      if(i.Mechanism[0])
        {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:10 ,

                product_variation_id:result.id
            },{
                attribute_id:10 ,
                value: i.Mechanism[0],
                product_variation_id:result.id
            })

        }
      if(i.separator[0])
        {

            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:11 ,

                product_variation_id:result.id
            },{
                attribute_id:11 ,
                value: i.separator[0],
                product_variation_id:result.id
            })
        }
      if(i.Width[0])
        {
            await  updateOrCreate(models.product_to_attribute,{
                attribute_id:12 ,

                product_variation_id:result.id
            },{
                attribute_id:12 ,
                value: i.Width[0],
                product_variation_id:result.id
            })

        }

      return true

    },
createAttributeKit: async (i) => {

        let result = await models.product_kit.findOne({where: {sku: i.GROUP_ID[0]}})



        if(i.Technology[0]) {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id: 1,

                product_kit_id: result.id
            },{
                attribute_kit_id: 1,
                value: i.Technology[0],
                product_kit_id: result.id
            })

        }
        if(i.Color[0]) {

            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id: 2,

                product_kit_id: result.id
            },{
                attribute_kit_id: 2,
                value: i.Color[0],
                product_kit_id: result.id
            })



        }

        if(i.Design[0])
        {

            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id: 3,

                product_kit_id: result.id
            },{
                attribute_kit_id: 3,
                value: i.Design[0],
                product_kit_id: result.id
            })

        }
        if(i.DrawerExtension[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id: 4,

                product_kit_id: result.id
            },{
                attribute_kit_id: 4,
                value: i.DrawerExtension[0],
                product_kit_id: result.id
            })


        }
        if(i.DrawerHeight[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id:5 ,

                product_kit_id:result.id
            },{
                attribute_kit_id:5 ,
                value: i.DrawerHeight[0],
                product_kit_id:result.id
            })

        }
        if(i.Facade[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id:6 ,

                product_kit_id:result.id
            },{
                attribute_kit_id:6 ,
                value: i.Facade[0],
                product_kit_id:result.id
            })

        }
        if(i.Length[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id:7 ,

                product_kit_id:result.id
            },{
                attribute_kit_id:7 ,
                value: i.Length[0],
                product_kit_id:result.id
            })
        }
        if(i.Lever[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id:8 ,

                product_kit_id:result.id
            },{
                attribute_kit_id:8 ,
                value: i.Lever[0],
                product_kit_id:result.id
            })
        }
        if(i.Load[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id:9 ,

                product_kit_id:result.id
            },{
                attribute_kit_id:9 ,
                value: i.Load[0],
                product_kit_id:result.id
            })
        }
        if(i.Mechanism[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id:10 ,

                product_kit_id:result.id
            },{
                attribute_kit_id:10 ,
                value: i.Mechanism[0],
                product_kit_id:result.id
            })
        }
        if(i.separator[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id:11 ,

                product_kit_id:result.id
            },{
                attribute_kit_id:11 ,
                value: i.separator[0],
                product_kit_id:result.id
            })
        }
        if(i.Width[0])
        {
            await  updateOrCreate(models.product_kit_to_attribute,{
                attribute_kit_id:12 ,

                product_kit_id:result.id
            },{
                attribute_kit_id:12 ,
                value: i.Width[0],
                product_kit_id:result.id
            })
        }
    },

}

