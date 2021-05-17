const salonService = require('../services/salon.service');







module.exports = {


    getSalesPerson: async (req, res) => {
        // let id = req.params.id
        // if (!id) {
        //     return res.status(403).json({ message: "User id not provided" });
        // }
        let result = await salonService.getSalesPersons(1);
        console.log(result)
      let list = [];  
      for (let item of result) {
          let arr = item.brand_id.split(",");
      if (arr && arr.length) {

        //   arr.forEach((element) => {
   
          
        //   });
        for(let key of arr){
          list.push(await salonService.getSalesPersonsBrands(key));
        }

      } 
  }
 
  var obj = Object.assign(result,{brands: list});
  console.log(obj.brands);

        return  res.render('client/handlowcy',{
        //  layout: 'client/layout-client',
       result: obj,
     
        })
    },

    createMessage: async (req, res) => {
let message =req.body.message;
let sales_id= req.body.example;
if(!sales_id|| !message){
    res.status(403).json({message:"Some field not provided"})
}
        let result = await salonService.MessageToSales({
            salon_id: 1,
            sales_id: sales_id,
            message: message
        })
console.log(result);
        return res.status(200).json(result);

    },

    getSalonById: async (req, res) => {
        let id = req.params.id;
        if (!id) {
            return res.status(403).json({ message: "User id not provided" });
        }
        let result = await salonService.getSalonById(id);

        res.status(200).json(result);



    },
    updateSalonById: async (req, res) => {
        let { billing_title, billing_address, billing_city, billing_zip, billing_nip, billing_first_name, billing_last_name, billing_phone, billing_email } = req.body;
        let id = req.headers.id;

        if (!billing_title || !billing_address || !billing_city || !billing_zip || !billing_nip || !billing_first_name || !billing_last_name || !billing_phone || !billing_email) {
            res.status(403).json({ message: "Some field provided" });
        }

        let result = await salonService.updateSalonById({
            billing_title: billing_title,
            billing_address: billing_address,
            billing_city: billing_city,
            billing_zip: billing_zip,
            billing_nip: billing_nip,
            billing_first_name: billing_first_name,
            billing_last_name: billing_last_name,
            billing_phone: billing_phone,
            billing_email: billing_email
        }, { id: id })


        res.status(200).json(result);
    },

    getSalonAddressById: async (req, res) => {
        // let id = req.headers.id;
        let result = await salonService.getSalonById(1);
        // if (!result.length) {
        //     return res.status(403).json({ message: "User id not provided" });
        // }
        
        return  res.render('client/informacje-adresy',{
           
           result: result
         
            })



        // res.status(200).json(result);

    },

    editSalonAddressById: async (req, res) => {
        let id = req.params.id;
        let { title, address, city, zip, first_name, last_name, phone, phone_contact, email, email_contact } = req.body;


        let result = await salonService.editSalonAddressById({ title, address, city, zip, first_name, last_name, phone, phone_contact, email, email_contact }, { id: id });

        return res.status(200).json(result);

    },
    deleteSalonAddressById: async (req, res) => {
        let id = req.params.id

        let result = await salonService.deleteSalonAddressId(id);
        if (!result.length) {
            return res.status(403).json({ message: " id not provided" });

        }
        return res.status(200).json(result);

    },

    checkSalonBrands: async (req, res) => {
        // let id = req.headers.id;
        let result = await salonService.getSalonBrands(1);
        if (!result.length) {
            return res.status(403).json({ message: "User id not provided" });

        }
        return  res.render('client/marki',{
            //  layout: 'client/layout-client',
           result: result
          
            })
        // return res.status(200).json(result);
    },
    checkPromotionsofBrands: async (req, res) => {
        let id = req.headers.id;

        // let result = await salonService.getBrandPromotions(id);

        let result = await salonService.getSalonBrands(id);
        if (!result.length) {
            return res.status(403).json({ message: "Brand id not provided" });
        }
        let list = [];
        for (let item of result) {
            list.push(item.brand_id);
        }
        let promotions = await salonService.getBrandPromotions(list);

        return res.status(200).json(promotions);
    },

    getMaterials: async (req, res) => {
        let id = req.headers.id;

        let result = await salonService.getSalonBrands(id);
        if (!result.length) {
            return res.status(403).json({ message: "Brand id not provided" });
        }
        let list = [];
        for (let item of result) {
            list.push(item.brand_id);
        }
        if (!list.length) {
            return res.status(403).json({ message: "Brand id not provided" });
        }
        let material_cat = await salonService.getMaterialsCatById(list);

        let cat_id = [];
        for (let item of material_cat) {
            cat_id.push(item.brand_id);
        }

        if (!cat_id.length) {
            return res.status(403).json({ message: "Cat_id not provided" });
        }
        let material = await salonService.getMaterials(cat_id);
        console.log(material)
        return res.status(200).json(material);

    },
    getMaterialsCatById: async (req, res) => {
        let id = req.headers.id;
        let result = await salonService.getSalonBrands(id);
        if (!result.length) {
            return res.status(403).json({ message: "Brand id not provided" });
        }
        let list = [];
        for (let item of result) {
            list.push(item.brand_id);
        }
   
        if (!list.length) {
            return res.status(403).json({ message: "Cat_id not provided" });
        }

        let material_cat = await salonService.getMaterialsCatById(list);

        return res.status(200).json(material_cat);


    },
    getBrandsSalesPerson :async (req,res)=>{
        let id = req.headers.id;
        let result = await salonService.getSalesPersons(id);
        if(!result.length)
        {
            return res.status(403).json({ message: "User id not provided" });
        }
      
        let list = [];  
        for (let item of result) {
            let arr = item.brand_id.split(",");
        if (arr && arr.length) {

            arr.forEach((element) => {
                list.push(element);
            });

        } 
    }
    
    
let brands= await salonService.getSalesPersonsBrands(list);
console.log(brands);
return res.status(200).json(brands);
  
 

    },
    getProducts : async(req,res)=>{
   let {brand_id,sort}= req.body;

   let result = await salonService.getProductsById(brand_id,sort);

   return res.status(200).json(result);


    },
    productForOrder: async (req,res) => {

     

            let {id,quantity,brand_id,user_id,address_id,salon_id} = req.body
            if (!quantity) {
                throw  new Error('please specify quantity')
            }
            let products = [id,quantity]

            products = JSON.stringify(products);

            const OrdersObj = {
                salon_id:salon_id,
                products:products,
                brand_id:brand_id,
                user_id:user_id,
                address_id:address_id
            }
            let myprod= await salonService.getProducts(id);
          
            if(quantity>myprod.count){
               
                return res.status(403).json({ message: "Not enought products" })
            }
            else        
{let result = await salonService.productForOrder(OrdersObj);
    let mycount =myprod.count-quantity;
    console.log(mycount);
let sobaka= await salonService.updateProductById({count:mycount},id);
console.log(sobaka);

            return res.status(200).json(result);

}
       
    },



}