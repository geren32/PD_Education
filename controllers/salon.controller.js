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
  console.log(obj);
const newObj ={...obj};
console.log(newObj);
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
        // return res.status(200).json(result);
        res.status(200).json({message:"Sucess"});
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
        let { billing_title, billing_zip, billing_address, billing_city,billing_nip, billing_first_name, billing_last_name, billing_phone, billing_email } = req.body;
    

        if (!billing_title || !billing_zip || !billing_address || !billing_city || !billing_nip || !billing_first_name || !billing_last_name || !billing_phone || !billing_email) {
            res.status(403).json({ message: "Some field provided" });
        }

        let result = await salonService.updateSalonById(
         req.body
        , { id: 1 })


        // res.status(200).json(result);
        res.status(200).json({message:"Sucess"});

    },
createSalonAddress:async(req,res)=>{
let{title,first_name,last_name,phone,email,address,zip,city,phone_contact,email_contact}=req.body;
let salon_id=1;
let result= await salonService.createSalonAddress({
    salon_id:salon_id,
    title:title,
    first_name:first_name,
    last_name:last_name,
    phone:phone,
    email:email,
    address:address,
    zip:zip,
    city:city,
    phone_contact:phone_contact,
    email_contact:email_contact})
    console.log(result)
return res.status(200).json({message:"Sucess"});

},


    getSalonAddressById: async (req, res) => {
        // let id = req.headers.id;
        let result = await salonService.getSalonById(1);
        // if (!result.length) {
        //     return res.status(403).json({ message: "User id not provided" });
        // }
        let shiping_address= await salonService.getSalonAdressBySalonId({salon_id:1});
   
        return  res.render('client/informacje-adresy',{
           salon_address:shiping_address,
           result: result
         
            })



        // res.status(200).json(result);

    },

    editSalonAddressById: async (req, res) => {
        // let id = req.params.id;
        let { title, address, city, zip, first_name, last_name, phone, phone_contact, email, email_contact } = req.body;


        let result = await salonService.editSalonAddressById({ title, address, city, zip, first_name, last_name, phone, phone_contact, email, email_contact }, { id: 1 });

        return res.status(200).json(result);

    },
    deleteSalonAddressById: async (req, res) => {
        let ids=req.params.id

// console.log(id.length)
try {
    
    let arr = ids.split(",");

        let result = await salonService.deleteSalonAddressId(arr);
   
   return res.status(200).json(result);    
} catch (error) {
    res.status(400).json({
        message: error.message,
        errCode: ''
    });
    
}


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
        // let id = req.headers.id;

        // let result = await salonService.getBrandPromotions(id);

        let result = await salonService.getSalonBrands(1);
        if (!result.length) {
            return res.status(403).json({ message: "Brand id not provided" });
        }
     
        let list = [];
        let salon_brands=[];
        let salons= []
        for (let item of result) {
            list.push(item.brand_id);
          let brands= await salonService.getSalesPersonsBrands(list);  
        salon_brands.push(brands);
        
        }
    
           for(let key of salon_brands){

// let mysalon= await salonService.getBrandPromotions(key.id);
// console.log(mysalon);
      salons.push(await salonService.getBrandPromotions(key.id));
 
} 
for(let key of salons){
    console.log(key[0].id);
}
// let obj = Object.assign( salons)
//   console.log(obj)
// console.log(salons);


// let obj = {...salon_brands,...salons}
// console.log(obj)
// const newObj= {...obj};
// console.log(newObj)
 return  res.render('client/informacje-promocje',{
          
            salon_brands:salon_brands,
            // obj: obj
            })



     
             

        // return res.status(200).json(promotions);
        
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