const fs = require("fs");

const sequelize = require('../sequelize-orm');
const addressService = require('../services/adress.service');
const bookingService = require('../services/booking.service');
const paymentService = require('../services/payment.service');
const ordersService = require('../services/order.service');
const productService = require('../services/product.service');
const variationService = require('../services/variation.service');
const userService = require('../services/user.service');
const brandService = require('../services/brand.service');
const manufacrureService = require('../services/manufacture.service');
const modelService = require('../services/model.service');
const categorieService = require('../services/categorie.service');
const attributesService = require('../services/attributes.service');
const adminProductService = require('../services/admin.product.service');
const adminImportProductService = require('../services/admin.import.product.service');
const config = require("../configs/config");

module.exports = {

    importProduct: async (req, res) => {
      let  result = await  adminImportProductService.importProduct();

        res.send(true)
    },



    createProduct: async (req, res) => {
        let user_id = req.headers.userid || req.userid;
        let files = req.files;
        if (typeof files === 'object' && files !== null) {
            files = Object.values(files).reduce((returned, item) => {
                if (item.length) {
                    for (let i of item) {
                        returned.push(i)
                    }
                }
                return returned
            }, []);
        }
        let { variation, type, short_description, description, name, price, old_price, availability, brand_id, model_id, sku, novelty, promo_label, recommended_products, similar_products, characteristic, categories, product_variations } = req.body;
        //TODO:Add middleware for image
        let promotional = false;
        try {
            if (!variation || !type || !short_description || !description || !name || !price || !categories || !availability || !brand_id || !model_id || !sku) {
                res.status(403).json("Some field provided");
                return;
            }
            if (old_price) {
                promotional = true;
                if (old_price < price) {
                  return  res.status(403).json("Price cannot be more than old price");
                    
                }
            }
            promo_label = JSON.stringify(promo_label)
            let image;
            if (req.files.image && req.files.image.length && req.files.image[0].path) {
                image = req.files.image[0].path;
            }
            let gallery = [];
            if (req.files.gallery && req.files.gallery.length) {
                for (let file of req.files.gallery) {
                    gallery.push(file.path);
                }
            }
            gallery = gallery.toString()

            // characteristic = characteristic.map(i => JSON.stringify(i))
            // characteristic = characteristic.join('|');
            characteristic = JSON.stringify(characteristic)
            recommended_products = recommended_products.toString()
            similar_products = similar_products.toString()
            let result = await productService.createProduct({
                variation,
                type, status: 1,
                created_user_id: user_id,
                short_description,
                description,
                name, price, old_price,
                availability, brand_id, model_id,
                sku, novelty, promotional, promo_label,
                gallery, recommended_products, similar_products,
                image, characteristic
            }, categories, product_variations);

            if (result.promo_label) result.promo_label = JSON.parse(result.promo_label)
            if (result.gallery) result.gallery = result.gallery.split(",");
            if (result.characteristic) result.characteristic = result.characteristic.split(",");
            if (result.recommended_products) result.recommended_products = result.recommended_products.split(",");
            if (result.similar_products) result.similar_products = result.similar_products.split(",");
         return   res.status(200).json(result);
            
        } catch (e) {
            // log.error(`Error to post /createProduct`);
            let err = new Error(e.message);
            if (files && files.length) {
                for (let file of files) {
                    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
            }
            err.code = 400;
            throw err;
        }
    },
    getAllProducts: async (req, res) => {
        let { category, sort, filter, brand, attributes, productIds } = req.body;
        //TODO: Add pagination
        let allProducts = await productService.getAllProducts(category, sort, filter, brand, attributes, productIds);

        for (let i of allProducts.products) {
            if (i.promo_label) i.promo_label = JSON.parse(i.promo_label)
            if (i.gallery) i.gallery = i.gallery.split(",");
            if (i.recommended_products) i.recommended_products = i.recommended_products.split(",");
            if (i.similar_products) i.similar_products = i.similar_products.split(",");
        }
        let attrinuteIds = []
        let brandIds = []
        let categotyProducts = await productService.getAllProducts(category)

        // for(let p = 0; p > categotyProducts.products.length; p++){
        //     console.log(categotyProducts.products[p]);
        //     for(let v = 0; v > categotyProducts.products[p].product_variations.length; v++){
        //         console.log(categotyProducts.products[p].product_variations);
        //         categotyProducts.products[p].product_variations[v].attribute.reduce((attrinuteIds, atr) => attrinuteIds.push(atr.id), []);
        //         // for(let a = 0; a > v.attribute.length; a++){
        //         //     attrinuteIds.push({id: categotyProducts[p].product_variations[v].attribute[a].id, value: a.activeValue.value, title: a.title, status: a.status, type: a.type})
        //         // }
        //     }
        // }

        for (let p of categotyProducts.products) {
            for (let v of p.product_variations) {
                for (let a of v.attribute) {
                    attrinuteIds.push({
                        id: a.id,
                        value: a.activeValue.value,
                        title: a.title,
                        status: a.status,
                        type: a.type
                    })
                }
            }
            brandIds.push(p.brand_id);
        }
        attrinuteIds = _(attrinuteIds)
            .uniqBy(v => [v.id, v.value].join())
            .value();
        attrinuteIds = _.groupBy(attrinuteIds, 'id');
        let finalAttributes = []
        for (let property in attrinuteIds) {
            let attribute = {}
            let arrOfAttr = attrinuteIds[property];
            attribute.id = property
            attribute.value = _.sortBy(arrOfAttr, 'value').map(i => i.value);
            attribute.title = arrOfAttr[0].title
            attribute.status = arrOfAttr[0].status
            attribute.type = arrOfAttr[0].type
            finalAttributes.push(attribute);
        }
        brandIds = _.uniq(brandIds);
        // let findedAttributes = await mysqlClient.getAttributes(attrinuteIds)
        // for (const atr of findedAttributes) {
        //     atr.value = JSON.parse(atr.value)
        // }
        let findedBrands = await brandService.getBrands(brandIds)
        let result = {
            products: allProducts.products,
            attributes: finalAttributes,
            brands: findedBrands,
            minPrice: allProducts.minPrice,
            maxPrice: allProducts.maxPrice
        }
      return  res.status(200).json(result);
        
    },

    getProductById: async (req, res) => {
        let id = req.params.id
        if (!id) {
           return res.status(403).json(errorUtil.forbidden(new Error("Product id not provided")));
            
        }
        let result = await mysqlClient.getProductById(id, false);

        if (result.promo_label) result.promo_label = JSON.parse(result.promo_label)
        if (result.gallery) result.gallery = result.gallery.split(",");
        if (result.recommended_products) result.recommended_products = result.recommended_products.split(",");
        if (result.similar_products) result.similar_products = result.similar_products.split(",");
        if (result.characteristic) {
            // result.characteristic = result.characteristic.split('|')
            // result.characteristic = result.characteristic.map(i => JSON.parse(i))
            result.characteristic = JSON.parse(result.characteristic)
        }

        let attrinuteIds = []
        for (let variation of result.product_variations) {
            for (let atr of variation.attribute) {
                attrinuteIds.push({
                    id: atr.id,
                    value: atr.activeValue.value,
                    title: atr.title,
                    status: atr.status,
                    type: atr.type
                })
                atr.value = JSON.parse(atr.value)
            }
        }
        attrinuteIds = _(attrinuteIds)
            .uniqBy(v => [v.id, v.value].join())
            .value();
        attrinuteIds = _.groupBy(attrinuteIds, 'id');
        let finalAttributes = []
        for (let property in attrinuteIds) {
            let attribute = {}
            let arrOfAttr = attrinuteIds[property];
            attribute.id = property
            attribute.value = _.sortBy(arrOfAttr, 'value').map(i => i.value);
            attribute.title = arrOfAttr[0].title
            attribute.status = arrOfAttr[0].status
            attribute.type = arrOfAttr[0].type
            finalAttributes.push(attribute);
        }
        let product = {
            product: result,
            attributes: finalAttributes
        }

        return { content: product }
    },

    deleteProduct: async (req, res) => {
        let { product_ids } = req.body;
        if (!product_ids) {
          return  res.status(403).json("Product id not provided");
            
        }
        let newProduct = await productService.deleteProduct(product_ids);
        return { content: newProduct }
    },

    editProductById: async (req, res) => {
        let id = req.params.id;
        let user_id = req.headers.userid || req.userid;
        let files = req.files;
        if (typeof files === 'object' && files !== null) {
            files = Object.values(files).reduce((returned, item) => {
                if (item.length) {
                    for (let i of item) {
                        returned.push(i)
                    }
                }
                return returned
            }, []);
        }
        let { variation, type, status, short_description, description, name, price, old_price, availability, brand_id, model_id, sku, novelty, promotional, promo_label, gallery, recommended_products, similar_products, characteristic, categories, product_variations } = req.body;
        try {
            //TODO:Add middleware for image
            if (!id) {
                res.status(403).json("Id not provided");
                return;
            }
            if (promotional === true) {
                if (old_price < price) {
                return    res.status(403).json("Price cannot be more than old price");
                    
                }
            } else {
                old_price = null;
            }
            let product = await productService.getProductById(id, false);
            let oldGallery = product.gallery ? product.gallery.split(",") : [];
            let oldImage = product.image ? product.image : null;
            let image;
            if (req.files.image && req.files.image.length && req.files.image[0].path) {
                image = req.files.image[0].path;
            }
            let gallery = [];
            if (req.files.gallery && req.files.gallery.length) {
                for (let file of req.files.gallery) {
                    gallery.push(file.path);
                }
            }
            if (characteristic) characteristic = JSON.stringify(characteristic)
            if (promo_label) promo_label = JSON.stringify(promo_label)
            if (gallery) gallery = gallery.toString()
            if (recommended_products) recommended_products = recommended_products.toString()
            if (similar_products) similar_products = similar_products.toString()

            let result = await productService.editProduct({
                variation, updated_user_id: user_id, type, status, short_description, description,
                name, price, old_price, availability,
                brand_id, model_id, sku, novelty,
                promotional, promo_label, gallery,
                recommended_products, similar_products,
                image, characteristic,updatedAt:Math.floor(new Date().getTime() / 1000)
            }, categories, product_variations, id);

            if (gallery && gallery.length != 0) {
                for (let file of oldGallery) {
                    if (file && fs.existsSync(file)) fs.unlinkSync(file);
                }
            }
            if (image && oldImage && fs.existsSync(oldImage)) fs.unlinkSync(oldImage);

            if (result.promo_label) result.promo_label = JSON.parse(result.promo_label)
            if (result.gallery) result.gallery = result.gallery.split(",");
            if (result.characteristic) result.characteristic = result.characteristic.split(",");
            if (result.recommended_products) result.recommended_products = result.recommended_products.split(",");
            if (result.similar_products) result.similar_products = result.similar_products.split(",");
            return { content: result }
        } catch (e) {
            // log.error(`Error to post /createProduct`);
            let err = new Error(e.message);
            if (files && files.length) {
                for (let file of files) {
                    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
            }
            err.code = 400;
            throw err;
        }
    },

    changeProductStatus: async (req, res) => {
        let user_id = req.headers.userid;
        let { status, product_ids } = req.body;
        let result = await productService.changeProductStatus({
            status: status,
            updated_user_id: user_id
        }, product_ids);
        return { content: result }
    },

    createVariation: async (req, res) => {
        let { product_id, sku, price, old_price, quantity, attrubutes } = req.body;
        let files = req.files;
        if (typeof files === 'object' && files !== null) {
            files = Object.values(files).reduce((returned, item) => {
                if (item.length) {
                    for (let i of item) {
                        returned.push(i)
                    }
                }
                return returned
            }, []);
        }
        try {
            let gallery = [];
            if (req.files.gallery && req.files.gallery.length) {
                for (let file of req.files.gallery) {
                    gallery.push(file.path);
                }
            }
            if (gallery) gallery = gallery.toString()
            let promotional = false;
            if (old_price) {
                promotional = true;
                if (old_price < price) {
                  return   res.status(403).json("Price cannot be more than old price");
                   
                }
            }
            let result = await variationService.createVariation({
                product_id,
                sku,
                price,
                old_price,
                gallery,
                quantity,
                promotional
            }, attrubutes);
            if (result.gallery) result.gallery = result.gallery.split(",");
         return   res.status(200).json(result);
            

        } catch (e) {
            // log.error(`Error to post /createProduct`);
            let err = new Error(e.message);
            if (files && files.length) {
                for (let file of files) {
                    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
            }
            err.code = 400;
            throw err;
        }
    },

    editVariationById: async (req, res) => {
        let id = req.params.id
        let { sku, price, old_price, quantity, product_id } = req.body;
        let files = req.files;
        if (typeof files === 'object' && files !== null) {
            files = Object.values(files).reduce((returned, item) => {
                if (item.length) {
                    for (let i of item) {
                        returned.push(i)
                    }
                }
                return returned
            }, []);
        }
        try {
            let gallery = [];
            if (req.files.gallery && req.files.gallery.length) {
                for (let file of req.files.gallery) {
                    gallery.push(file.path);
                }
            }
            let product = await productService.getProductById(product_id, false)
            let variation = await variationService.getVariationById(id)
            let oldGallery = variation.gallery ? variation.gallery.split(",") : [];

            let promotional = false;
            if (product.status != 2) {
                if (!id) {
                  return  res.status(403).json("Variation id or title not provided");
                    
                }
                if (old_price) {
                    promotional = true;
                    if (old_price < price) {
                     return   res.status(403).json("Price cannot be more than old price");
                        
                    }
                }
                gallery = gallery.toString()
                variation = await variationService.editVariation(id, {
                    sku,
                    price,
                    old_price,
                    gallery,
                    quantity,
                    promotional
                });
                if (gallery && gallery.length != 0) {
                    for (let file of oldGallery) {
                        if (file && fs.existsSync(file)) fs.unlinkSync(file);
                    }
                }
            }
            return res.status(200).json(variation);
           
        } catch (e) {
            // log.error(`Error to post /createProduct`);
            let err = new Error(e.message);
            if (files && files.length) {
                for (let file of files) {
                    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
            }
            err.code = 400;
            throw err;
        }
    },

    deleteVariation: async (req, res) => {
        let { variation_id, product_id } = req.body;
        let product = await productService.getProductById(product_id, false)
        let result = null
        if (product.status != 2) {
            result = await variationService.deleteVariation(variation_id);
        }
      return  res.status(200).json(result);
        
    },

    changeVariationStatus: async (req, res) => {
        let { variation_id, product_id } = req.body;
        let product = await productService.getProductById(product_id, false)
        let result = null
        if (product && product.status != 2) {
            result = await variationService.changeVariationStatus(variation_id, product_id);
        }
      return  res.status(200).json(result);
        
    },

    createManufacturer: async (req, res) => {
        let { title } = req.body;
        if (!title) {
           return res.status(403).json("Incorrect title provided");
            
        }
        let newManufacturer = await manufacrureService.createManufacturer(title);
      return  res.status(200).json(newManufacturer);
        
    },

    getManufacturers: async (req, res) => {
        //TODO: Add pagination
        let models = await manufacrureService.getManufacturers();
         return res.status(200).json(models);
      
    },

    getManufacturerById: async (req, res) => {
        let id = req.params.id
        if (!id) {
           return res.status(403).json("Manufacturer id not provided");
            
        }
        let model = await manufacrureService.getManufacturerById(id);
      return  res.status(200).json(model);
        
    },

    deleteManufacturerById: async (req, res) => {
        let id = req.params.id
        if (!id) {
         return   res.status(403).json("Manufacturer id not provided");
            
        }
        let model = await manufacrureService.deleteManufacturer(id);
       return res.status(200).json(model);
        
    },

    editManufacturerById: async (req, res) => {
        let id = req.params.id
        let { title } = req.body;
        if (!id || !title) {
        return    res.status(403).json("Manufacturer id or title not provided");
            
        }
        let category = await manufacrureService.editManufacturer(id, title);
     return   res.status(200).json(category);
        
    },
    createModel: async (req, res) => {
        let { title } = req.body;
        if (!title) {
         return   res.status(403).json("Incorrect title provided");
            
        }
        let newModel = await modelService.createModel(title);
      return  res.status(200).json(newModel);
        
    },

    getModels: async (req, res) => {
        //TODO: Add pagination
        let models = await modelService.getModels();
        return res.status(200).json(models);
       
    },

    getModelById: async (req, res) => {
        let id = req.params.id
        if (!id) {
        return    res.status(403).json("Model id not provided");
            
        }
        let model = await modelService.getModelById(id);
     return   res.status(200).json(model);
        
    },
    deleteModelById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return  res.status(403).json("Model id not provided");
            
        }
        let model = await modelService.deleteModel(id);
      return  res.status(200).json(model);
        

    },
    editModelById: async (req, res) => {
        let id = req.params.id
        let { title } = req.body;
        if (!id || !title) {
           return  res.status(403).json("Model id or title not provided");
           
        }
        let model = await modelService.editModel(id, title);
      return  res.status(200).json(model);
        
    },

    createCategory: async (req, res) => {
        //TODO:Add image middleware
        let { title } = req.body;
        let file = req.file;
        let image = file && file.path ? file.path : null;
        try {
            //TODO: "created_at": null, "updated_at": null
            let newCategory = await categorieService.createCategory({ title, image });
         return   res.status(200).json(newCategory);
            
        } catch (e) {
            // log.error(`Error post /createCategory ${JSON.stringify(req.body)}`);
            let err = new Error(e.message);
            if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            err.code = 400;
            throw err;
        }
    },

    getCategories: async (req, res) => {
        //TODO: Add pagination
        let categories = await categorieService.getCategories(true);
      return  res.status(200).json(categories);
        
    },

    getCategoryById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return  res.status(403).json("Category id not provided");
            
        }
        let category = await categorieService.getCategoryById(id);
       return res.status(200).json(category);
        
    },

    deleteCategoryById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return  res.status(403).json("Category id not provided");
            
        }
        let category = await categorieService.deleteCategory(id);
        return res.status(200).json(category);
       

    },

    editCategoryById: async (req, res) => {
        let id = req.params.id
        let { title } = req.body;
        if (!id) {
          return  res.status(403).json("Category id or title not provided");
            
        }
        let category = await categorieService.editCategory(id, title);
      return  res.status(200).json(category);
        
    },

    createBrand: async (req, res) => {
        let { title, manufacturer_id } = req.body;
        if (!title || !manufacturer_id) {
          return  res.status(403).json("Incorrect title provided");
            
        }
        let newBrand = await brandService.createBrand({ title, manufacturer_id });
      return  res.status(200).json(newBrand);
        
    },

    getBrands: async (req, res) => {
        //TODO: Add pagination
        let models = await brandService.getBrands();
      return  res.status(200).json(models);
        
    },

    getBrandById: async (req, res) => {
        let id = req.params.id
        if (!id) {
         return   res.status(403).json("Brand id not provided");
            
        }
        let model = await brandService.getBrandById(id);
      return  res.status(200).json(model);
        
    },

    deleteBrandById: async (req, res) => {
        let id = req.params.id
        if (!id) {
         return   res.status(403).json("Brand id not provided");
            
        }
        let model = await brandService.deleteBrand(id);
      return  res.status(200).json(model);
        
    },

    editBrandById: async (req, res) => {
        let id = req.params.id
        let { title } = req.body;
        if (!id) {
          return  res.status(403).json("Brand id or title not provided");
            
        }
        let category = await brandService.editBrand(id, title);
      return  res.status(200).json(category);
        
    },

    createAttribute: async (req, res) => {
        let { value, title, type, unitOfMeasurement } = req.body;
        try {
            value = JSON.stringify(value)
            let positionNumber = await adminProductService.countsAttribute({});
            let attribute = await adminProductService.createAttribute({ 
                value, 
                title, 
                status: config.GLOBAL_STATUSES.ACTIVE, 
                type,
                unit_of_measurement: unitOfMeasurement,
                position: ++positionNumber

             });
         return   res.status(200).json(attribute);
            

        } catch (error) {
         return   res.status(400).json({
                message: error.message,
                errCode: '400'
            });
            
        }
    },

    getAttributes: async (req, res) => {
        //TODO: Add pagination
        let attributes = await attributesService.getAttributes();
       return res.status(200).json(attributes);
        
    },

    getAttributeById: async (req, res) => {
        let id = req.params.id
        if (!id) {
           return res.status(403).json("getAttribute id not provided");
            
        }
        let attribute = await attributesService.getAttributeById(id);
       return res.status(200).json(attribute);
        
    },

    deleteAttributeById: async (req, res) => {
        let id = req.params.id
        if (!id) {
          return  res.status(403).json("Attribute id not provided");
            
        }
        let attribute = await attributesService.deleteAttribute(id);
       return  res.status(200).json(attribute);
       
    },

    editAttributeById: async (req, res) => {
        let id = req.params.id
        let { value, title, status } = req.body;
        if (!id) {
          return  res.status(403).json("Attribute id or title not provided");
            
        }
        //TODO:Validation for value
        value = JSON.stringify(value)
        let attribute = await attributesService.editAttribute(id, { value, title, status });
       return res.status(200).json(attribute);
        
    }


}
