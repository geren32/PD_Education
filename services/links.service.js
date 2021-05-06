const {models}= require('../sequelize-orm');
const sequelize= require('../sequelize-orm');
const {Op}= require("sequelize");






module.exports={

createLinks: async(links,trans)=>{
let transaction= null;
try {
    transaction = trans ? trans : await sequelize.transaction();
    let result = await models.links.create(links, {transaction});
 
    result= await models.links.findOne({
        where: {id:result.id},
        transaction
    })
if(!trans) await transaction.commit();

return result;

}
catch (err) {
    err.code = 400;
    if (transaction) await transaction.rollback();
    throw err;
}


},

getLinkBySlag: async (slag)=>{
    let result = await models.links.findOne({
        where:slag
    });

    return result;
},

getAllLinks: async (slag,trans)=>{
//   let transaction = null ;
let transaction= null ;
  try{ transaction = trans ? trans : await sequelize.transaction();
      let result = await models.links.findAll({
       where: slag
   })
   if (!trans) await transaction.commit();
   return result;
}
    catch (err) {
    if (transaction) await transaction.rollback();
    err.code = 400;
    throw err;}


},
updateLinks: async (links,slag,trans)=>{
   let transaction= null ;
   try{
    transaction = trans ? trans : await sequelize.transaction();
    await models.links.update(links,{where: {slag:slag },transaction})
    let result = await models.links.findOne({
        where:slag,
        transaction
    })
    if (!trans) await transaction.commit();
    return result;
   }
   catch (err) {
    if (transaction) await transaction.rollback();
    err.code = 400;
    throw err;
}
},
deleteLinksBySlag: async(slag, trans)=>{
    let transaction = null;
    try {
        transaction = trans ? trans : await sequelize.transaction();
        console.log(slag);
        let result = await models.links.destroy({
            where: slag
        , transaction})
        if (!trans) await transaction.commit();
        return result;
    } catch (err) {
        err.code = 400;
        if (transaction) await transaction.rollback();
        throw err;
    }

}




}