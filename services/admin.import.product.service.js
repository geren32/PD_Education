const { models } = require('../sequelize-orm');
const sequelize = require('../sequelize-orm');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const fs = require('fs')
const block = require('./admin.import.block.service')
const  xml2js = require('xml2js')
const {slugify} = require('transliteration');
slugify.config({ lowercase: true, separator: '-' });

module.exports = {

    importProduct: async (attribute) => {

        const parser = new xml2js.Parser();
        let contre = 0;


        await fs.readFile('uploads/import/import.xml', async function(err, data) {
            parser.parseString(data, async function (err, j) {
                 for( let i of j.Products.Product ) {
                    if(i.Price[0])
                    {
                        i.Price[0] = await i.Price[0].replace(',','.')
                    }
                    // let ParentCode = i.ParentCode[0].split("-"); old import file type

                    const productJ = {
                        name: i.Nomenclature[0],
                        sku: i.GROUP_ID[0],
                        image: i.AddressImage[0] ? '/img/'+ i.AddressImage[0] : '/img/icons/Blum-Product-empty_placeholder.jpg',
                        short_description:(i.Description[0])? i.Description[0] : i.Nomenclature[0],
                        description: (i.Description[0])? i.Description[0] : i.Nomenclature[0],
                        price: (i.Price[0])? parseFloat(i.Price[0]): 0,
                        status: 2,
                        recommended_products: '',
                        similar_products: '',
                        availability: 2,
                        promotional: 2,
                        gallery:  i.AddressImage[0] ? '/img/'+i.AddressImage[0] + ',' +'/img/'+ i.AddressImage[0] : '/img/icons/Blum-Product-empty_placeholder.jpg',
                    }

                    const ParentCode1 =   i.ParentCode1 ? i.ParentCode1[0] : ''
                    const ParentCode2 =   i.ParentCode2 ? i.ParentCode2[0] : ''
                    const ParentCode3 =   i.ParentCode3 ? i.ParentCode3[0] : ''
                    const ParentCode4 =   i.ParentCode4 ? i.ParentCode4[0] : ''
                    const ParentCode5 =   i.ParentCode5 ? i.ParentCode5[0] : ''

                    if(   ( ParentCode1 == '000007586'
                        || ParentCode2 == '000007586'
                        || ParentCode3 == '000007586'
                        || ParentCode4 == '000007586'
                        || ParentCode5 == '000007586' ) && !i.ProductDetails) {
                        contre++

                        let isCategoryCreated = await models.product_category.findOne({where: {title: i.Parent[0]}})
                        let categorySlag;
                        if(!isCategoryCreated) {
                            let slagTitle = i.Parent[0].split('- ')[1];
                            categorySlag = slugify(slagTitle);
                            let checkSlag = await models.links.findOne({where: {slag: categorySlag}});
                            if (checkSlag) {
                                categorySlag = slugify(i.Parent[0].split('-')[0] + categorySlag);
                                // categorySlag = slugify(i.Parent[0]);
                            }
                        }
                        let productSlag;
                        let isProductCreated = await models.product.findOne({where: {sku: productJ.sku}})
                        if(!isProductCreated) {
                            productSlag = slugify(productJ.name);
                            let checkSlag = await models.links.findOne({where: {slag: productSlag}});
                            if (checkSlag) {
                                productSlag = productSlag + '-' + productJ.sku;
                            }
                        } else if(isProductCreated && isProductCreated.name !== productJ.name) {
                            let slag;
                            slag = slugify(productJ.name);
                            let checkSlag = await models.links.findOne({where: {slag: slag}});
                            if (checkSlag) {
                                slag = slag + '-' + productJ.sku;
                            }
                            await models.links.destroy({where: {slag: isProductCreated.slag}});
                            await models.product.update({slag: slag},{where: {id: isProductCreated.id}});
                            await models.links.create({slag: slag, link: `/shop/product/${slag}`, type: 'product'});
                        }

                        const product_category = await block.updateOrCreate(models.product_category,
                            {
                                title: i.Parent[0]
                            },
                            {
                                title: i.Parent[0],
                                status: 2,
                                parrent: 0,
                                image: '/img/icons/Blum-Product-empty_placeholder.jpg'
                            });
                        if(product_category && categorySlag) {
                            await models.product_category.update({slag: categorySlag},{where: {id: product_category.id}});
                            await models.links.create({slag: categorySlag, link: `/shop/catalog/${categorySlag}`, type: 'catalog'});
                        }
                         const product = await block.updateOrCreate(models.product, {sku: i.GROUP_ID[0]}, productJ);

                        if(product && productSlag) {
                            await models.links.create({slag: productSlag, link: `/shop/product/${productSlag}`, type: 'product'});
                            await models.product.update({slag: productSlag},{where: {id: product.id}});
                        }

                        if( product.id)
                        {
                            await block.updateOrCreate(models.product_to_category,
                                {
                                    product_id: product.id,
                                    product_category_id: product_category.id
                                },
                                {
                                    product_id: product.id,
                                    product_category_id: product_category.id
                                });

                        }


                        let productVariationsJ = {
                            sku: i.GROUP_ID[0],
                            product_id: product.id,
                            price: (i.Price[0]) ? parseFloat(i.Price[0]) : 0,
                            status: 2,
                            promotional: 0,
                            gallery: i.AddressImage[0] ? '/img/' + i.AddressImage[0] + ',' + '/img/' + i.AddressImage[0] : '/img/icons/Blum-Product-empty_placeholder.jpg',
                        }
                        await block.updateOrCreate(models.product_variations, {sku: i.GROUP_ID[0]}, productVariationsJ);
                        await block.createAttribute(i);
                    }

                }

            });
        });
        await fs.readFile('uploads/import/import.xml', async function(err, data) {
            parser.parseString(data, async function (err, result) {
                for( let i of result.Products.Product ) {


                    const productJ = {
                        name: i.Nomenclature[0],
                        sku: i.GROUP_ID[0],
                        image: i.AddressImage[0] ? '/img/' + i.AddressImage[0] : '/img/icons/Blum-Product-empty_placeholder.jpg',
                       // image: '/img/icons/Blum-Product-empty_placeholder.jpg',
                        short_description:(i.Description[0])? i.Description[0] : i.Nomenclature[0],
                        description: (i.Description[0])? i.Description[0] : i.Nomenclature[0],
                        price: (i.Price[0])? parseFloat(i.Price[0]): 0,
                        status: 2,
                        recommended_products: '',
                        similar_products: '',
                        availability: 2,
                        promotional: 2,
                        kit: i.Product[0] ? i.Product[0] : '',
                        gallery: i.AddressImage[0] ? '/img/'+i.AddressImage[0] + ',' +'/img/'+ i.AddressImage[0] : '/img/icons/Blum-Product-empty_placeholder.jpg'
                    }

                    const ParentCode1 =   i.ParentCode1 ? i.ParentCode1[0] : ''
                    const ParentCode2 =   i.ParentCode2 ? i.ParentCode2[0] : ''
                    const ParentCode3 =   i.ParentCode3 ? i.ParentCode3[0] : ''
                    const ParentCode4 =   i.ParentCode4 ? i.ParentCode4[0] : ''
                    const ParentCode5 =   i.ParentCode5 ? i.ParentCode5[0] : ''

                    if(  i.ProductDetails) {
                        /// add product kit


                        // let result = await models.product_kit.create(productJ);

                        const title = i.Parent[0] ? i.Parent[0]: ''

                        let isCategoryKitCreated = await models.product_kit_category.findOne({where: {title: title}})
                        let categorySlag;
                        if(!isCategoryKitCreated) {
                            categorySlag = slugify(title);
                        }

                        let productSlag;
                        let isProductCreated = await models.product_kit.findOne({where: {sku: productJ.sku}})
                        if(!isProductCreated) {
                            productSlag = slugify(productJ.name);
                            let checkSlag = await models.links.findOne({where: {slag: productSlag}});
                            if (checkSlag) {
                                productSlag = productSlag + '-' + productJ.sku;
                            }
                        } else if(isProductCreated && isProductCreated.name !== productJ.name) {
                            let slag;
                            slag = slugify(productJ.name);
                            let checkSlag = await models.links.findOne({where: {slag: slag}});
                            if (checkSlag) {
                                slag = slag + '-' + productJ.sku;
                            }
                            await models.links.destroy({where: {slag: isProductCreated.slag}});
                            await models.product_kit.update({slag: slag},{where: {id: isProductCreated.id}});
                            await models.links.create({slag: slag, link: `/shop/product-kit/${slag}`, type: 'kit'});
                        }

                    const product_kit_category = await   block.updateOrCreate(models.product_kit_category,
                        {
                            title: title
                        },
                        {
                            title: title,
                        status:2,
                        parrent:0,
                        image:'/img/icons/Blum-Product-empty_placeholder.jpg'
                    });

                        if(product_kit_category && categorySlag) {
                            await models.product_kit_category.update({slag: categorySlag},{where: {id: product_kit_category.id}});
                            await models.links.create({slag: categorySlag, link: `/shop/catalog-kit/${categorySlag}`, type: 'kit-category'});
                        }

                       let result  = await block.updateOrCreate(models.product_kit,{ sku: i.GROUP_ID[0]},productJ);

                        if(!result.id)
                        {
                            console.log(i.GROUP_ID[0])
                            console.log( result.id)
                            console.log( result)
                        }

                        if(result && productSlag) {
                            await models.links.create({slag: productSlag, link: `/shop/product-kit/${productSlag}`, type: 'kit'});
                            await models.product.update({slag: productSlag},{where: {id: result.id}});
                        }


                            await   block.updateOrCreate(models.product_kit_to_category_kit,{
                                product_kit_category_id: product_kit_category.id,
                                product_kit_id: result.id
                            },{
                                product_kit_category_id: product_kit_category.id,
                                product_kit_id: result.id
                            });



                        if (i.ProductDetails) {
                            let iterator = 0;
                            let price = 0;
                            for (let item of i.ProductDetails[0].ProductDetail) {
                                let product_for_kit = await models.product.findOne({where: {sku: item.CodeBlum[0]}})
                                if (product_for_kit && product_for_kit.id) {
                                    await block.updateOrCreate(models.product_to_kit, {
                                        product_kit_id: result.id,
                                        product_id: product_for_kit.id,
                                        quantity: item.Quantity[0],
                                        substitute: iterator,
                                        position: 0
                                    }, {
                                        product_kit_id: result.id,
                                        product_id: product_for_kit.id,
                                        quantity: item.Quantity[0],
                                        substitute: iterator,
                                        position: 0
                                    })
                                   iterator++

                                    price = price + product_for_kit.price * (item.Quantity[0] > 0 ?item.Quantity[0]: 1);
                                    await models.product_kit.update({price:price},{where:{sku: i.GROUP_ID[0]}});
                                }



                            }
                        }

                        await  block.createAttributeKit(i);
                    }


                }

            });
        });

        return contre

    },


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


    createAttribute: async (product_variations_j ,i) => {


        await  models.product_to_attribute.create(
            {
                attribute_id:1 ,
                value: i.Technology[0],
                product_variation_id:product_variations_j.id
            }
        )


        await  models.product_to_attribute.create(
            {
                attribute_id:2 ,
                value: i.Color[0],
                product_variation_id:product_variations_j.id
            }
        )
    },

}
